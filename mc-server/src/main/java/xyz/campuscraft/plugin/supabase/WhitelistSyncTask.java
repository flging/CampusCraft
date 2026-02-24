package xyz.campuscraft.plugin.supabase;

import org.bukkit.scheduler.BukkitRunnable;
import xyz.campuscraft.plugin.manager.WhitelistManager;

public class WhitelistSyncTask extends BukkitRunnable {

    private final WhitelistManager whitelistManager;

    public WhitelistSyncTask(WhitelistManager whitelistManager) {
        this.whitelistManager = whitelistManager;
    }

    @Override
    public void run() {
        whitelistManager.syncAll();
    }
}
