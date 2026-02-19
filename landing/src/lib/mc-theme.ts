// 마크 채팅 색상 코드 (실제 마크 FontRenderer.java 기준)
export const MC = {
  GOLD: "#FFAA00",
  GREEN: "#55FF55",
  DARK_GREEN: "#00AA00",
  RED: "#FF5555",
  DARK_RED: "#AA0000",
  AQUA: "#55FFFF",
  WHITE: "#FFFFFF",
  GRAY: "#AAAAAA",
  DARK_GRAY: "#555555",
  BLACK: "#000000",
  YELLOW: "#FFFF55",
} as const;

// 마크 텍스트 그림자 — 실제 마크: +1px 오프셋, RGB 각 /4
export function mcShadow(color: string): string {
  const darken = (hex: string) => {
    const r = Math.floor(parseInt(hex.slice(1, 3), 16) * 0.25);
    const g = Math.floor(parseInt(hex.slice(3, 5), 16) * 0.25);
    const b = Math.floor(parseInt(hex.slice(5, 7), 16) * 0.25);
    return `rgb(${r}, ${g}, ${b})`;
  };
  return `2px 2px 0px ${darken(color)}`;
}

// 마크 네임태그 배경
export const MC_NAMETAG_BG = "rgba(0, 0, 0, 0.25)";

// 랜딩페이지 배경색
export const BG_DARK = "#1a1a2e";
export const BG_DARKER = "#12121f";
