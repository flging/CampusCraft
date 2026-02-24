package xyz.campuscraft.plugin.command;

import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.NamedTextColor;
import net.kyori.adventure.text.format.TextColor;
import org.bukkit.Bukkit;
import org.bukkit.command.Command;
import org.bukkit.command.CommandExecutor;
import org.bukkit.command.CommandSender;
import org.bukkit.command.TabCompleter;
import org.bukkit.entity.Player;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import xyz.campuscraft.plugin.CampusCraftPlugin;
import xyz.campuscraft.plugin.model.RegisteredPlayer;
import xyz.campuscraft.plugin.model.UniversityInfo;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class CampusCraftCommand implements CommandExecutor, TabCompleter {

    private final CampusCraftPlugin plugin;

    public CampusCraftCommand(CampusCraftPlugin plugin) {
        this.plugin = plugin;
    }

    @Override
    public boolean onCommand(@NotNull CommandSender sender, @NotNull Command command,
                             @NotNull String label, @NotNull String[] args) {
        if (args.length == 0) {
            sendHelp(sender);
            return true;
        }

        switch (args[0].toLowerCase()) {
            case "sync" -> handleSync(sender);
            case "info" -> handleInfo(sender, args);
            case "stats" -> handleStats(sender);
            default -> sendHelp(sender);
        }

        return true;
    }

    private void handleSync(CommandSender sender) {
        sender.sendMessage(Component.text("[CampusCraft] 화이트리스트 동기화 중...", NamedTextColor.YELLOW));

        Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> {
            plugin.getWhitelistManager().syncAll();
            Bukkit.getScheduler().runTask(plugin, () ->
                    sender.sendMessage(Component.text("[CampusCraft] 동기화 완료! 캐시: "
                            + plugin.getWhitelistManager().getCacheSize() + "명", NamedTextColor.GREEN))
            );
        });
    }

    private void handleInfo(CommandSender sender, String[] args) {
        if (args.length < 2) {
            sender.sendMessage(Component.text("사용법: /cc info <닉네임>", NamedTextColor.YELLOW));
            return;
        }

        String nickname = args[1];
        Optional<RegisteredPlayer> opt = plugin.getWhitelistManager().getFromCache(nickname);

        if (opt.isEmpty()) {
            sender.sendMessage(Component.text("[CampusCraft] '" + nickname + "' 정보를 찾을 수 없습니다.",
                    NamedTextColor.RED));
            return;
        }

        RegisteredPlayer rp = opt.get();
        UniversityInfo uni = rp.universityTag() != null
                ? plugin.getUniversityManager().getByTag(rp.universityTag()) : null;
        TextColor uniColor = uni != null ? TextColor.fromHexString(uni.colorHex()) : NamedTextColor.WHITE;

        sender.sendMessage(Component.text("--- 플레이어 정보 ---", NamedTextColor.GOLD));
        sender.sendMessage(Component.text("닉네임: ", NamedTextColor.GRAY)
                .append(Component.text(rp.minecraftNickname(), NamedTextColor.WHITE)));
        sender.sendMessage(Component.text("대학교: ", NamedTextColor.GRAY)
                .append(Component.text(
                        uni != null ? uni.name() : (rp.universityName() != null ? rp.universityName() : "미확인"),
                        uniColor)));
        sender.sendMessage(Component.text("태그: ", NamedTextColor.GRAY)
                .append(Component.text(rp.universityTag() != null ? rp.universityTag() : "없음",
                        uniColor)));
        sender.sendMessage(Component.text("인증: ", NamedTextColor.GRAY)
                .append(Component.text(rp.emailVerified() ? "완료" : "미완료",
                        rp.emailVerified() ? NamedTextColor.GREEN : NamedTextColor.RED)));
    }

    private void handleStats(CommandSender sender) {
        sender.sendMessage(Component.text("--- CampusCraft 통계 ---", NamedTextColor.GOLD));
        sender.sendMessage(Component.text("온라인: ", NamedTextColor.GRAY)
                .append(Component.text(Bukkit.getOnlinePlayers().size() + "명", NamedTextColor.WHITE)));
        sender.sendMessage(Component.text("화이트리스트 캐시: ", NamedTextColor.GRAY)
                .append(Component.text(plugin.getWhitelistManager().getCacheSize() + "명",
                        NamedTextColor.WHITE)));
        sender.sendMessage(Component.text("등록 대학: ", NamedTextColor.GRAY)
                .append(Component.text(plugin.getUniversityManager().count() + "개",
                        NamedTextColor.WHITE)));

        // 대학별 접속 인원
        sender.sendMessage(Component.text("--- 대학별 접속 현황 ---", NamedTextColor.GOLD));
        for (UniversityInfo uni : plugin.getUniversityManager().getAll()) {
            int count = plugin.getTeamManager().getTeamPlayerCount(uni.tag());
            if (count > 0) {
                TextColor color = TextColor.fromHexString(uni.colorHex());
                sender.sendMessage(
                        Component.text("[" + uni.tag() + "] ", color)
                                .append(Component.text(uni.name() + ": ", NamedTextColor.GRAY))
                                .append(Component.text(count + "명", NamedTextColor.WHITE))
                );
            }
        }
    }

    private void sendHelp(CommandSender sender) {
        sender.sendMessage(Component.text("--- CampusCraft 명령어 ---", NamedTextColor.GOLD));
        sender.sendMessage(Component.text("/cc sync", NamedTextColor.GREEN)
                .append(Component.text(" - 화이트리스트 즉시 동기화", NamedTextColor.GRAY)));
        sender.sendMessage(Component.text("/cc info <닉네임>", NamedTextColor.GREEN)
                .append(Component.text(" - 플레이어 정보 조회", NamedTextColor.GRAY)));
        sender.sendMessage(Component.text("/cc stats", NamedTextColor.GREEN)
                .append(Component.text(" - 서버 통계", NamedTextColor.GRAY)));
    }

    @Override
    public @Nullable List<String> onTabComplete(@NotNull CommandSender sender, @NotNull Command command,
                                                @NotNull String label, @NotNull String[] args) {
        List<String> completions = new ArrayList<>();
        if (args.length == 1) {
            for (String sub : List.of("sync", "info", "stats")) {
                if (sub.startsWith(args[0].toLowerCase())) {
                    completions.add(sub);
                }
            }
        } else if (args.length == 2 && args[0].equalsIgnoreCase("info")) {
            for (Player p : Bukkit.getOnlinePlayers()) {
                if (p.getName().toLowerCase().startsWith(args[1].toLowerCase())) {
                    completions.add(p.getName());
                }
            }
        }
        return completions;
    }
}
