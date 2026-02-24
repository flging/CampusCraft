package xyz.campuscraft.plugin.config;

import org.bukkit.configuration.file.FileConfiguration;

public class PluginConfig {

    private final String supabaseUrl;
    private final String supabaseApiKey;
    private final String supabaseTable;
    private final int syncIntervalMinutes;
    private final String msgKickNotRegistered;
    private final String msgKickNotVerified;
    private final String msgWelcomeFirst;
    private final String msgWelcomeBack;

    public PluginConfig(FileConfiguration config) {
        this.supabaseUrl = config.getString("supabase.url", "");
        this.supabaseApiKey = config.getString("supabase.api-key", "");
        this.supabaseTable = config.getString("supabase.table", "pre_registrations");
        this.syncIntervalMinutes = config.getInt("sync.interval-minutes", 5);
        this.msgKickNotRegistered = colorize(config.getString("messages.kick-not-registered",
                "&c사전신청이 확인되지 않았습니다."));
        this.msgKickNotVerified = colorize(config.getString("messages.kick-not-verified",
                "&c이메일 인증이 완료되지 않았습니다."));
        this.msgWelcomeFirst = config.getString("messages.welcome-first",
                "&a{player}님, {university} 팀에 오신 것을 환영합니다!");
        this.msgWelcomeBack = config.getString("messages.welcome-back",
                "&a{player}님이 접속했습니다. [{tag}]");
    }

    private static String colorize(String s) {
        return s.replace("&", "\u00a7");
    }

    public String getSupabaseUrl() { return supabaseUrl; }
    public String getSupabaseApiKey() { return supabaseApiKey; }
    public String getSupabaseTable() { return supabaseTable; }
    public int getSyncIntervalMinutes() { return syncIntervalMinutes; }
    public String getMsgKickNotRegistered() { return msgKickNotRegistered; }
    public String getMsgKickNotVerified() { return msgKickNotVerified; }
    public String getMsgWelcomeFirst() { return msgWelcomeFirst; }
    public String getMsgWelcomeBack() { return msgWelcomeBack; }
}
