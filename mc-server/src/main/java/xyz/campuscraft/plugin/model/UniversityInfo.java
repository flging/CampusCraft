package xyz.campuscraft.plugin.model;

import org.bukkit.Color;

public record UniversityInfo(
        String id,
        String name,
        String tag,
        String colorHex,
        Color color
) {
    public UniversityInfo(String id, String name, String tag, String colorHex) {
        this(id, name, tag, colorHex, hexToColor(colorHex));
    }

    private static Color hexToColor(String hex) {
        String h = hex.startsWith("#") ? hex.substring(1) : hex;
        return Color.fromRGB(
                Integer.parseInt(h.substring(0, 2), 16),
                Integer.parseInt(h.substring(2, 4), 16),
                Integer.parseInt(h.substring(4, 6), 16)
        );
    }
}
