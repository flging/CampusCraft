package xyz.campuscraft.plugin.listener;

import org.bukkit.event.EventHandler;
import org.bukkit.event.Listener;
import org.bukkit.event.entity.PlayerDeathEvent;
import org.bukkit.event.inventory.InventoryClickEvent;
import org.bukkit.event.inventory.InventoryDragEvent;
import org.bukkit.event.inventory.InventoryType;
import org.bukkit.event.player.PlayerDropItemEvent;
import org.bukkit.inventory.ItemStack;
import xyz.campuscraft.plugin.manager.GwajamManager;

public class GwajamProtectListener implements Listener {

    @EventHandler
    public void onDrop(PlayerDropItemEvent event) {
        if (GwajamManager.isGwajam(event.getItemDrop().getItemStack())) {
            event.setCancelled(true);
        }
    }

    @EventHandler
    public void onInventoryClick(InventoryClickEvent event) {
        // 과잠을 갑옷 슬롯에서 빼거나 다른 인벤토리로 이동 방지
        ItemStack current = event.getCurrentItem();
        ItemStack cursor = event.getCursor();

        if (GwajamManager.isGwajam(current)) {
            // 상자 등 외부 인벤토리로 이동 시 차단
            if (event.getClickedInventory() != null
                    && event.getClickedInventory().getType() == InventoryType.PLAYER
                    && event.getView().getTopInventory().getType() != InventoryType.CRAFTING) {
                // 플레이어 인벤토리에서 상자로 Shift-Click 등
                if (event.isShiftClick()) {
                    event.setCancelled(true);
                    return;
                }
            }

            // 갑옷 슬롯에서 제거 방지 (슬롯 36~39)
            int slot = event.getSlot();
            if (slot >= 36 && slot <= 39 && event.getClickedInventory() != null
                    && event.getClickedInventory().getType() == InventoryType.PLAYER) {
                event.setCancelled(true);
                return;
            }
        }

        // 커서에 과잠이 있을 때 외부 인벤토리에 놓기 방지
        if (GwajamManager.isGwajam(cursor)) {
            if (event.getClickedInventory() != null
                    && event.getClickedInventory().getType() != InventoryType.PLAYER) {
                event.setCancelled(true);
            }
        }
    }

    @EventHandler
    public void onInventoryDrag(InventoryDragEvent event) {
        if (GwajamManager.isGwajam(event.getOldCursor())) {
            // 외부 인벤토리 슬롯에 드래그 방지
            for (int slot : event.getRawSlots()) {
                if (slot < event.getView().getTopInventory().getSize()) {
                    if (event.getView().getTopInventory().getType() != InventoryType.CRAFTING) {
                        event.setCancelled(true);
                        return;
                    }
                }
            }
        }
    }

    @EventHandler
    public void onDeath(PlayerDeathEvent event) {
        // 사망 시 과잠 드롭 방지
        event.getDrops().removeIf(GwajamManager::isGwajam);
    }
}
