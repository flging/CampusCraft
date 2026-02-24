import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { MC_TITLE_FONT, MC_KR_FONT, MC, mcShadow } from "../styles/fonts";
import { zoomPunch, screenShake, quickFadeIn } from "../effects";

export const ShortsReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 로고 줌펀치 (frame 3)
  const logoScale = zoomPunch(frame, fps, 3, 1.4);
  const logoOpacity = quickFadeIn(frame, 3, 4);
  const logoShake = screenShake(frame, 3, 7, 20, "reveal");

  // 부제 (frame 25)
  const subScale = zoomPunch(frame, fps, 25, 1.2);
  const subOpacity = quickFadeIn(frame, 25, 5);

  // ac.kr 라인 (frame 45)
  const acScale = zoomPunch(frame, fps, 45, 1.15);
  const acOpacity = quickFadeIn(frame, 45, 5);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${logoShake.x}px, ${logoShake.y}px)`,
      }}
    >
      {/* CampusCraft 로고 */}
      <div
        style={{
          fontFamily: MC_TITLE_FONT,
          fontSize: 58,
          color: MC.WHITE,
          letterSpacing: 3,
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          textShadow: [
            "-3px -3px 0px #555555",
            "3px -3px 0px #555555",
            "-3px 3px 0px #555555",
            "3px 3px 0px #555555",
            "5px 5px 0px #333333",
            "7px 7px 0px #222222",
            "10px 12px 8px rgba(0,0,0,0.5)",
          ].join(", "),
        }}
      >
        CampusCraft
      </div>

      {/* 대학생 전용 마인크래프트 서버 */}
      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 30,
          color: MC.GOLD,
          textShadow: mcShadow(MC.GOLD),
          marginTop: 30,
          transform: `scale(${subScale})`,
          opacity: subOpacity,
        }}
      >
        대학생 전용 마인크래프트 서버
      </div>

      {/* ac.kr 인증 한 번이면 끝 */}
      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 26,
          color: MC.GRAY,
          textShadow: mcShadow(MC.GRAY),
          marginTop: 20,
          transform: `scale(${acScale})`,
          opacity: acOpacity,
        }}
      >
        ac.kr 인증 한 번이면 끝
      </div>
    </div>
  );
};
