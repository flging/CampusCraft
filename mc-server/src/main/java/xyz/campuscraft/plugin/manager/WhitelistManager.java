package xyz.campuscraft.plugin.manager;

import xyz.campuscraft.plugin.model.RegisteredPlayer;
import xyz.campuscraft.plugin.supabase.SupabaseClient;

import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

public class WhitelistManager {

    private static final Logger LOGGER = Logger.getLogger("CampusCraft");

    private final ConcurrentHashMap<String, RegisteredPlayer> cache = new ConcurrentHashMap<>();
    private final SupabaseClient supabaseClient;
    private final org.bukkit.plugin.Plugin plugin;

    public WhitelistManager(SupabaseClient supabaseClient, org.bukkit.plugin.Plugin plugin) {
        this.supabaseClient = supabaseClient;
        this.plugin = plugin;
    }

    /**
     * 전체 동기화 — Supabase에서 인증된 유저 전체를 가져와 캐시 갱신
     */
    public void syncAll() {
        try {
            var players = supabaseClient.fetchVerifiedPlayers();
            ConcurrentHashMap<String, RegisteredPlayer> newCache = new ConcurrentHashMap<>();
            for (var p : players) {
                if (p.minecraftNickname() != null && !p.minecraftNickname().isEmpty()) {
                    newCache.put(p.minecraftNickname().toLowerCase(), p);
                }
            }
            cache.clear();
            cache.putAll(newCache);
            LOGGER.info("[CampusCraft] 화이트리스트 동기화 완료: " + cache.size() + "명");
        } catch (Exception e) {
            LOGGER.warning("[CampusCraft] 화이트리스트 동기화 실패: " + e.getMessage());
        }
    }

    /**
     * 캐시에서 조회
     */
    public Optional<RegisteredPlayer> getFromCache(String nickname) {
        return Optional.ofNullable(cache.get(nickname.toLowerCase()));
    }

    /**
     * 실시간 조회 — 캐시에 없을 때 Supabase에서 직접 조회 후 캐시에 추가
     */
    public Optional<RegisteredPlayer> fetchAndCache(String nickname) {
        var result = supabaseClient.fetchPlayerByNickname(nickname);
        result.ifPresent(p -> {
            if (p.emailVerified()) {
                cache.put(p.minecraftNickname().toLowerCase(), p);
            }
        });
        return result;
    }

    /**
     * 3단계 검증: 캐시 → Supabase 실시간 → 없음
     */
    public Optional<RegisteredPlayer> verify(String nickname) {
        // 1단계: 캐시 확인
        var cached = getFromCache(nickname);
        if (cached.isPresent()) return cached;

        // 2단계: Supabase 실시간 조회
        return fetchAndCache(nickname);
    }

    public int getCacheSize() {
        return cache.size();
    }
}
