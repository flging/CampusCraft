package xyz.campuscraft.plugin.command;

import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.format.TextColor;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.entity.Player;
import org.bukkit.scoreboard.Team;
import org.jetbrains.annotations.NotNull;
import xyz.campuscraft.plugin.manager.TeamManager;
import xyz.campuscraft.plugin.manager.UniversityManager;
import xyz.campuscraft.plugin.model.UniversityInfo;

public class TeamChatCommand implements CommandExecutor {

    private final TeamManager teamManager;
    private final UniversityManager universityManager;

    public TeamChatCommand(TeamManager teamManager, UniversityManager universityManager) {
        this.teamManager = teamManager;
        this.universityManager = universityManager;
    }

    @Override
    public boolean onCommand(@NotNull CommandSender sender, @NotNull Command command,
                             @NotNull String label, @NotNull String[] args) {
        if (!(sender instanceof Player player)) {
            sender.sendMessage(Component.text("플레이어만 사용할 수 있습니다.", NamedTextColor.RED));
            return true;
        }

        if (args.length == 0) {
            player.sendMessage(Component.text("사용법: /tc <메시지>", NamedTextColor.YELLOW));
            return true;
        }

        String tag = teamManager.getPlayerTeamTag(player);
        if (tag == null) {
            player.sendMessage(Component.text("팀에 소속되어 있지 않습니다.", NamedTextColor.RED));
            return true;
        }

        String message = String.join(" ", args);
        UniversityInfo uni = universityManager.getByTag(tag);
        TextColor color = uni != null ? TextColor.fromHexString(uni.colorHex()) : NamedTextColor.WHITE;

        Component chatMessage = Component.text("[팀채팅] ", NamedTextColor.GOLD)
                .append(Component.text("[" + tag + "] ", color))
                .append(Component.text(player.getName(), NamedTextColor.WHITE))
                .append(Component.text(": ", NamedTextColor.GRAY))
                .append(Component.text(message, NamedTextColor.WHITE));

        // 같은 팀원에게만 전송
        Team team = teamManager.getTeam(tag);
        if (team != null) {
            for (String entry : team.getEntries()) {
                Player teamPlayer = player.getServer().getPlayerExact(entry);
                if (teamPlayer != null && teamPlayer.isOnline()) {
                    teamPlayer.sendMessage(chatMessage);
                }
            }
        }

        return true;
    }
}
