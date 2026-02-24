import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { MC_KR_FONT, MC, mcShadow } from "../styles/fonts";
import { zoomPunch, screenShake, quickFadeIn } from "../effects";

export const ShortsProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const textScale = zoomPunch(frame, fps, 3, 1.3);
  const textOpacity = quickFadeIn(frame, 3, 4);
  const shake = screenShake(frame, 3, 5, 12, "problem");

  // "없지?" 강조 — 살짝 늦게 + 더 크게
  const emphasisScale = zoomPunch(frame, fps, 12, 1.5);
  const emphasisOpacity = quickFadeIn(frame, 12, 4);
  const shake2 = screenShake(frame, 12, 6, 16, "problem2");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${shake.x + shake2.x}px, ${shake.y + shake2.y}px)`,
      }}
    >
      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 52,
          color: MC.WHITE,
          textShadow: mcShadow(MC.WHITE),
          transform: `scale(${textScale})`,
          opacity: textOpacity,
          marginBottom: 15,
        }}
      >
        마크 같이 할 사람
      </div>
      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 80,
          color: MC.RED,
          textShadow: mcShadow(MC.RED),
          transform: `scale(${emphasisScale})`,
          opacity: emphasisOpacity,
        }}
      >
        없지?
      </div>
    </div>
  );
};
