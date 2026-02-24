package xyz.campuscraft.plugin.manager;

import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.TextColor;
import org.bukkit.Bukkit;
import org.bukkit.entity.Player;
import org.bukkit.scoreboard.Scoreboard;
import org.bukkit.scoreboard.Team;
import xyz.campuscraft.plugin.model.UniversityInfo;

import java.util.Objects;

public class TeamManager {

    private final Scoreboard scoreboard;
    private final UniversityManager universityManager;

    public TeamManager(UniversityManager universityManager) {
        this.universityManager = universityManager;
        this.scoreboard = Objects.requireNonNull(Bukkit.getScoreboardManager()).getMainScoreboard();
        initTeams();
    }

    private void initTeams() {
        for (UniversityInfo uni : universityManager.getAll()) {
            Team team = scoreboard.getTeam(uni.tag());
            if (team == null) {
                team = scoreboard.registerNewTeam(uni.tag());
            }
            TextColor color = TextColor.fromHexString(uni.colorHex());
            team.prefix(Component.text("[" + uni.tag() + "] ").color(color));
            team.color(nearestNamedColor(uni.colorHex()));
            team.setAllowFriendlyFire(true);
            team.setCanSeeFriendlyInvisibles(true);
        }
    }

    public void assignPlayer(Player player, String universityTag) {
        // Remove from any existing team
        for (Team team : scoreboard.getTeams()) {
            team.removeEntity(player);
        }

        Team team = scoreboard.getTeam(universityTag);
        if (team != null) {
            team.addEntity(player);
        }
    }

    public String getPlayerTeamTag(Player player) {
        Team team = scoreboard.getEntityTeam(player);
        return team != null ? team.getName() : null;
    }

    public Team getTeam(String tag) {
        return scoreboard.getTeam(tag);
    }

    public int getTeamPlayerCount(String tag) {
        Team team = scoreboard.getTeam(tag);
        return team != null ? team.getSize() : 0;
    }

    /**
     * HEX → 가장 가까운 NamedTextColor (scoreboard team color 용)
     */
    private net.kyori.adventure.text.format.NamedTextColor nearestNamedColor(String hex) {
        String h = hex.startsWith("#") ? hex.substring(1) : hex;
        int r = Integer.parseInt(h.substring(0, 2), 16);
        int g = Integer.parseInt(h.substring(2, 4), 16);
        int b = Integer.parseInt(h.substring(4, 6), 16);

        return net.kyori.adventure.text.format.NamedTextColor.nearestTo(
                TextColor.color(r, g, b)
        );
    }
}
