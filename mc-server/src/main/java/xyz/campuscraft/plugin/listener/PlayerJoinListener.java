package xyz.campuscraft.plugin.listener;

import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.format.TextColor;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.player.AsyncPlayerPreLoginEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import xyz.campuscraft.plugin.CampusCraftPlugin;
import xyz.campuscraft.plugin.config.PluginConfig;
import xyz.campuscraft.plugin.model.RegisteredPlayer;
import xyz.campuscraft.plugin.model.UniversityInfo;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

public class PlayerJoinListener implements Listener {

    private final CampusCraftPlugin plugin;
    private final Set<String> firstJoinPending = new HashSet<>();

    public PlayerJoinListener(CampusCraftPlugin plugin) {
        this.plugin = plugin;
    }

    @EventHandler(priority = EventPriority.NORMAL)
    public void onAsyncPreLogin(AsyncPlayerPreLoginEvent event) {
        String nickname = event.getName();
        PluginConfig config = plugin.getPluginConfig();

        // 3단계 검증
        Optional<RegisteredPlayer> result = plugin.getWhitelistManager().verify(nickname);

        if (result.isEmpty()) {
            event.disallow(
                    AsyncPlayerPreLoginEvent.Result.KICK_WHITELIST,
                    Component.text(config.getMsgKickNotRegistered())
            );
            return;
        }

        RegisteredPlayer rp = result.get();
        if (!rp.emailVerified()) {
            event.disallow(
                    AsyncPlayerPreLoginEvent.Result.KICK_WHITELIST,
                    Component.text(config.getMsgKickNotVerified())
            );
        }
    }

    @EventHandler(priority = EventPriority.NORMAL)
    public void onPlayerJoin(PlayerJoinEvent event) {
        Player player = event.getPlayer();
        String nickname = player.getName();

        Optional<RegisteredPlayer> optRp = plugin.getWhitelistManager().getFromCache(nickname);
        if (optRp.isEmpty()) return;

        RegisteredPlayer rp = optRp.get();
        String tag = rp.universityTag();

        if (tag != null) {
            // 팀 배정
            plugin.getTeamManager().assignPlayer(player, tag);

            UniversityInfo uni = plugin.getUniversityManager().getByTag(tag);
            String uniName = uni != null ? uni.name() : (rp.universityName() != null ? rp.universityName() : tag);
            TextColor uniColor = uni != null ? TextColor.fromHexString(uni.colorHex()) : NamedTextColor.WHITE;

            if (!player.hasPlayedBefore()) {
                // 첫 입장: 과잠 지급 + 환영 메시지
                plugin.getGwajamManager().equipGwajam(player, tag);

                event.joinMessage(
                        Component.text("[CampusCraft] ", NamedTextColor.GREEN)
                                .append(Component.text(nickname, NamedTextColor.WHITE))
                                .append(Component.text("님, ", NamedTextColor.WHITE))
                                .append(Component.text(uniName, uniColor))
                                .append(Component.text(" 팀에 오신 것을 환영합니다!", NamedTextColor.WHITE))
                );
            } else {
                // 재접속
                event.joinMessage(
                        Component.text("[CampusCraft] ", NamedTextColor.GREEN)
                                .append(Component.text(nickname, NamedTextColor.WHITE))
                                .append(Component.text("님이 접속했습니다. ", NamedTextColor.WHITE))
                                .append(Component.text("[" + tag + "]", uniColor))
                );
            }
        }
    }
}
