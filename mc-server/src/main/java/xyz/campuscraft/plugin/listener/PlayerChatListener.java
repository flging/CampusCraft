package xyz.campuscraft.plugin.listener;

import io.papermc.paper.event.player.AsyncChatEvent;
import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.format.TextColor;
import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import xyz.campuscraft.plugin.manager.TeamManager;
import xyz.campuscraft.plugin.manager.UniversityManager;
import xyz.campuscraft.plugin.model.UniversityInfo;

public class PlayerChatListener implements Listener {

    private final TeamManager teamManager;
    private final UniversityManager universityManager;

    public PlayerChatListener(TeamManager teamManager, UniversityManager universityManager) {
        this.teamManager = teamManager;
        this.universityManager = universityManager;
    }

    @EventHandler(priority = EventPriority.HIGHEST)
    public void onChat(AsyncChatEvent event) {
        Player player = event.getPlayer();
        String tag = teamManager.getPlayerTeamTag(player);

        if (tag != null) {
            UniversityInfo uni = universityManager.getByTag(tag);
            TextColor color = uni != null ? TextColor.fromHexString(uni.colorHex()) : NamedTextColor.WHITE;

            event.renderer((source, sourceDisplayName, message, viewer) ->
                    Component.text("[" + tag + "] ", color)
                            .append(Component.text(source.getName(), NamedTextColor.WHITE))
                            .append(Component.text(": ", NamedTextColor.GRAY))
                            .append(message)
            );
        }
    }
}
