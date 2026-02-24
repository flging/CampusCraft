package xyz.campuscraft.plugin;

import org.bukkit.plugin.java.JavaPlugin;
import xyz.campuscraft.plugin.command.CampusCraftCommand;
import xyz.campuscraft.plugin.command.TeamChatCommand;
import xyz.campuscraft.plugin.config.PluginConfig;
import xyz.campuscraft.plugin.listener.GwajamProtectListener;
import xyz.campuscraft.plugin.listener.PlayerChatListener;
import xyz.campuscraft.plugin.listener.PlayerJoinListener;
import xyz.campuscraft.plugin.manager.GwajamManager;
import xyz.campuscraft.plugin.manager.TeamManager;
import xyz.campuscraft.plugin.manager.UniversityManager;
import xyz.campuscraft.plugin.manager.WhitelistManager;
import xyz.campuscraft.plugin.supabase.SupabaseClient;
import xyz.campuscraft.plugin.supabase.WhitelistSyncTask;

public class CampusCraftPlugin extends JavaPlugin {

    private PluginConfig pluginConfig;
    private UniversityManager universityManager;
    private SupabaseClient supabaseClient;
    private WhitelistManager whitelistManager;
    private TeamManager teamManager;
    private GwajamManager gwajamManager;

    @Override
    public void onEnable() {
        // Config
        saveDefaultConfig();
        this.pluginConfig = new PluginConfig(getConfig());

        // Managers
        this.universityManager = new UniversityManager();
        this.supabaseClient = new SupabaseClient(pluginConfig);
        this.whitelistManager = new WhitelistManager(supabaseClient, this);
        this.teamManager = new TeamManager(universityManager);
        this.gwajamManager = new GwajamManager(universityManager);

        // Initial sync
        whitelistManager.syncAll();

        // Periodic sync task
        long intervalTicks = pluginConfig.getSyncIntervalMinutes() * 60L * 20L;
        new WhitelistSyncTask(whitelistManager).runTaskTimerAsynchronously(this, intervalTicks, intervalTicks);

        // Listeners
        var pm = getServer().getPluginManager();
        pm.registerEvents(new PlayerJoinListener(this), this);
        pm.registerEvents(new PlayerChatListener(teamManager, universityManager), this);
        pm.registerEvents(new GwajamProtectListener(), this);

        // Commands
        var ccCmd = getCommand("cc");
        if (ccCmd != null) {
            var handler = new CampusCraftCommand(this);
            ccCmd.setExecutor(handler);
            ccCmd.setTabCompleter(handler);
        }
        var tcCmd = getCommand("tc");
        if (tcCmd != null) {
            tcCmd.setExecutor(new TeamChatCommand(teamManager, universityManager));
        }

        getLogger().info("CampusCraft 플러그인 활성화! " + universityManager.count() + "개 대학 등록됨.");
    }

    @Override
    public void onDisable() {
        getLogger().info("CampusCraft 플러그인 비활성화.");
    }

    public PluginConfig getPluginConfig() { return pluginConfig; }
    public UniversityManager getUniversityManager() { return universityManager; }
    public WhitelistManager getWhitelistManager() { return whitelistManager; }
    public TeamManager getTeamManager() { return teamManager; }
    public GwajamManager getGwajamManager() { return gwajamManager; }
}
