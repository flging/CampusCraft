import { loadFont } from "@remotion/google-fonts/PressStart2P";
import { loadFont as loadSilkscreen } from "@remotion/google-fonts/Silkscreen";
import { staticFile } from "remotion";

const { fontFamily: pixelFont } = loadFont();
const { fontFamily: silkscreenFont } = loadSilkscreen();

// Galmuri11 — 한글 지원 픽셀 폰트 로드
const galmuriUrl = staticFile("fonts/Galmuri11.woff2");
if (typeof document !== "undefined") {
  const font = new FontFace(
    "Galmuri11",
    `url('${galmuriUrl}') format('woff2')`
  );
  font.load().then(() => (document.fonts as any).add(font));
}

// 마크 로고/타이틀용 픽셀 폰트 (영문 전용)
export const MC_TITLE_FONT = pixelFont;

// 마크 채팅/본문용 폰트 (영문)
export const MC_CHAT_FONT = silkscreenFont;

// 한글+영문 픽셀 폰트 — 마크 감성 한글 텍스트에 사용
export const MC_KR_FONT = '"Galmuri11", monospace';

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

// 마크 네임태그 배경 — 실제 마크: rgba(0, 0, 0, 0.25)
export const MC_NAMETAG_BG = "rgba(0, 0, 0, 0.25)";
