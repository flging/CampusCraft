package xyz.campuscraft.plugin.manager;

import net.kyori.adventure.text.Component;
import net.kyori.adventure.text.format.TextColor;
import net.kyori.adventure.text.format.TextDecoration;
import org.bukkit.Material;
import org.bukkit.NamespacedKey;
import org.bukkit.entity.Player;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.LeatherArmorMeta;
import org.bukkit.persistence.PersistentDataType;
import xyz.campuscraft.plugin.model.UniversityInfo;

public class GwajamManager {

    public static final NamespacedKey GWAJAM_KEY = new NamespacedKey("campuscraft", "gwajam");

    private final UniversityManager universityManager;

    public GwajamManager(UniversityManager universityManager) {
        this.universityManager = universityManager;
    }

    /**
     * 과잠 갑옷 세트 생성 및 착용
     */
    public void equipGwajam(Player player, String universityTag) {
        UniversityInfo uni = universityManager.getByTag(universityTag);
        if (uni == null) return;

        player.getInventory().setHelmet(createPiece(Material.LEATHER_HELMET, uni, "투구"));
        player.getInventory().setChestplate(createPiece(Material.LEATHER_CHESTPLATE, uni, "상의"));
        player.getInventory().setLeggings(createPiece(Material.LEATHER_LEGGINGS, uni, "하의"));
        player.getInventory().setBoots(createPiece(Material.LEATHER_BOOTS, uni, "신발"));
    }

    private ItemStack createPiece(Material material, UniversityInfo uni, String pieceName) {
        ItemStack item = new ItemStack(material);
        LeatherArmorMeta meta = (LeatherArmorMeta) item.getItemMeta();

        // 대학 컬러 염색
        meta.setColor(uni.color());

        // 표시명
        TextColor color = TextColor.fromHexString(uni.colorHex());
        meta.displayName(
                Component.text(uni.name() + " 과잠 (" + pieceName + ")")
                        .color(color)
                        .decoration(TextDecoration.ITALIC, false)
        );

        // Unbreakable
        meta.setUnbreakable(true);

        // PersistentDataContainer 태그
        meta.getPersistentDataContainer().set(GWAJAM_KEY, PersistentDataType.STRING, uni.tag());

        item.setItemMeta(meta);
        return item;
    }

    /**
     * 아이템이 과잠인지 확인
     */
    public static boolean isGwajam(ItemStack item) {
        if (item == null || !item.hasItemMeta()) return false;
        return item.getItemMeta().getPersistentDataContainer().has(GWAJAM_KEY, PersistentDataType.STRING);
    }
}
