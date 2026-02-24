import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { MC_KR_FONT, MC, mcShadow } from "../styles/fonts";
import { zoomPunch, screenShake } from "../effects";

export const ShortsHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "너" 슬램 (frame 3)
  const line1Scale = zoomPunch(frame, fps, 3, 1.35);
  const line1Opacity = interpolate(frame, [3, 6], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // "대학생이야?" 슬램 (frame 15)
  const line2Scale = zoomPunch(frame, fps, 15, 1.4);
  const line2Opacity = interpolate(frame, [15, 18], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  // 쉐이크
  const shake1 = screenShake(frame, 3, 6, 15, "hook1");
  const shake2 = screenShake(frame, 15, 6, 18, "hook2");
  const shakeX = shake1.x + shake2.x;
  const shakeY = shake1.y + shake2.y;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 80,
          color: MC.WHITE,
          textShadow: mcShadow(MC.WHITE),
          transform: `scale(${line1Scale})`,
          opacity: line1Opacity,
          marginBottom: 20,
        }}
      >
        너
      </div>
      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 72,
          color: MC.YELLOW,
          textShadow: mcShadow(MC.YELLOW),
          transform: `scale(${line2Scale})`,
          opacity: line2Opacity,
        }}
      >
        대학생이야?
      </div>
    </div>
  );
};
