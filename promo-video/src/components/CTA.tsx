import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { MC_TITLE_FONT, MC_KR_FONT, MC, mcShadow } from "../styles/fonts";

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 로고 등장 (0~20)
  const logoScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // 부제 페이드인 (20~35)
  const subtitleOpacity = interpolate(frame, [20, 35], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subtitleY = interpolate(frame, [20, 35], [15, 0], {
    extrapolateRight: "clamp",
  });

  // 버튼 등장 (35~50)
  const buttonScale = spring({
    frame: Math.max(0, frame - 35),
    fps,
    config: { damping: 10, stiffness: 100 },
  });

  // 버튼 펄스
  const pulse = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.95, 1.0]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MC_TITLE_FONT,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* CampusCraft 로고 — 흰색 3D 블록 스타일 */}
      <div
        style={{
          position: "relative",
          transform: `scale(${logoScale})`,
          fontSize: 52,
          color: MC.WHITE,
          letterSpacing: 4,
          textShadow: [
            "-3px -3px 0px #555555",
            "3px -3px 0px #555555",
            "-3px 3px 0px #555555",
            "3px 3px 0px #555555",
            "4px 4px 0px #444444",
            "5px 5px 0px #444444",
            "6px 6px 0px #333333",
            "7px 7px 0px #333333",
            "8px 8px 0px #222222",
            "10px 12px 8px rgba(0,0,0,0.5)",
          ].join(", "),
        }}
      >
        CampusCraft
      </div>

      {/* 부제 — Galmuri11 한글 픽셀 */}
      <div
        style={{
          position: "relative",
          opacity: subtitleOpacity,
          transform: `translateY(${subtitleY}px)`,
          fontFamily: MC_KR_FONT,
          fontSize: 24,
          color: MC.GRAY,
          marginTop: 30,
          letterSpacing: 2,
          textShadow: mcShadow(MC.GRAY),
        }}
      >
        대학생 전용 마인크래프트 서버
      </div>

      {/* MC 돌 버튼 — 사전 신청 시작 */}
      <div
        style={{
          position: "relative",
          transform: `scale(${buttonScale * pulse})`,
          marginTop: 50,
          background:
            "linear-gradient(180deg, #6d6d6d 0%, #4a4a4a 45%, #3a3a3a 55%, #4a4a4a 100%)",
          border: "3px solid #1a1a1a",
          borderTop: "3px solid #8a8a8a",
          borderLeft: "3px solid #8a8a8a",
          padding: "16px 44px",
          fontFamily: MC_KR_FONT,
          color: MC.WHITE,
          fontSize: 24,
          letterSpacing: 2,
          textShadow: mcShadow(MC.WHITE),
        }}
      >
        사전 신청 시작
      </div>
    </div>
  );
};
