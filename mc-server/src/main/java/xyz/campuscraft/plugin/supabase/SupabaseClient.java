package xyz.campuscraft.plugin.supabase;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import xyz.campuscraft.plugin.config.PluginConfig;
import xyz.campuscraft.plugin.model.RegisteredPlayer;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

public class SupabaseClient {

    private static final Logger LOGGER = Logger.getLogger("CampusCraft");
    private static final Gson GSON = new Gson();

    private final String baseUrl;
    private final String apiKey;
    private final String table;
    private final HttpClient httpClient;

    public SupabaseClient(PluginConfig config) {
        this.baseUrl = config.getSupabaseUrl();
        this.apiKey = config.getSupabaseApiKey();
        this.table = config.getSupabaseTable();
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
    }

    /**
     * 전체 인증된 유저 목록 조회 (벌크 동기화용)
     */
    public List<RegisteredPlayer> fetchVerifiedPlayers() {
        List<RegisteredPlayer> players = new ArrayList<>();
        try {
            String url = baseUrl + "/rest/v1/" + table
                    + "?email_verified=eq.true"
                    + "&select=email,minecraft_nickname,university_tag,university_name,email_verified";

            HttpRequest request = buildRequest(url);
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                LOGGER.warning("Supabase 조회 실패: HTTP " + response.statusCode());
                return players;
            }

            JsonArray array = GSON.fromJson(response.body(), JsonArray.class);
            for (JsonElement el : array) {
                RegisteredPlayer p = parsePlayer(el.getAsJsonObject());
                if (p != null) players.add(p);
            }
        } catch (Exception e) {
            LOGGER.warning("Supabase 연결 오류: " + e.getMessage());
        }
        return players;
    }

    /**
     * 닉네임으로 단일 유저 조회 (실시간 검증용)
     */
    public Optional<RegisteredPlayer> fetchPlayerByNickname(String nickname) {
        try {
            String url = baseUrl + "/rest/v1/" + table
                    + "?minecraft_nickname=eq." + nickname
                    + "&select=email,minecraft_nickname,university_tag,university_name,email_verified"
                    + "&limit=1";

            HttpRequest request = buildRequest(url);
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                LOGGER.warning("Supabase 단일 조회 실패: HTTP " + response.statusCode());
                return Optional.empty();
            }

            JsonArray array = GSON.fromJson(response.body(), JsonArray.class);
            if (array.isEmpty()) return Optional.empty();

            RegisteredPlayer p = parsePlayer(array.get(0).getAsJsonObject());
            return Optional.ofNullable(p);
        } catch (Exception e) {
            LOGGER.warning("Supabase 단일 조회 오류: " + e.getMessage());
            return Optional.empty();
        }
    }

    private HttpRequest buildRequest(String url) {
        return HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("apikey", apiKey)
                .header("Authorization", "Bearer " + apiKey)
                .header("Accept", "application/json")
                .timeout(Duration.ofSeconds(10))
                .GET()
                .build();
    }

    private RegisteredPlayer parsePlayer(JsonObject obj) {
        try {
            return new RegisteredPlayer(
                    obj.has("email") ? obj.get("email").getAsString() : "",
                    obj.has("minecraft_nickname") ? obj.get("minecraft_nickname").getAsString() : "",
                    obj.has("university_tag") && !obj.get("university_tag").isJsonNull()
                            ? obj.get("university_tag").getAsString() : null,
                    obj.has("university_name") && !obj.get("university_name").isJsonNull()
                            ? obj.get("university_name").getAsString() : null,
                    obj.has("email_verified") && obj.get("email_verified").getAsBoolean()
            );
        } catch (Exception e) {
            LOGGER.warning("플레이어 파싱 오류: " + e.getMessage());
            return null;
        }
    }
}
