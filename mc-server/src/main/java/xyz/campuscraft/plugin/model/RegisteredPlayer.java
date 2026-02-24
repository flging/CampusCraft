package xyz.campuscraft.plugin.model;

public record RegisteredPlayer(
        String email,
        String minecraftNickname,
        String universityTag,
        String universityName,
        boolean emailVerified
) {
}
