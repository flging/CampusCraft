import React from "react";
import { useCurrentFrame, interpolate, Easing } from "remotion";

// 시네마틱 레터박스 + 비네팅 오버레이
export const CinematicOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // 레터박스 바 높이 — 서서히 등장
  const barHeight = interpolate(frame, [0, 30], [0, 120], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // 비네팅 강도
  const vignetteOpacity = interpolate(frame, [0, 40], [0, 0.6], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* 비네팅 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
          opacity: vignetteOpacity,
        }}
      />

      {/* 상단 레터박스 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: barHeight,
          backgroundColor: "#000",
        }}
      />

      {/* 하단 레터박스 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: barHeight,
          backgroundColor: "#000",
        }}
      />
    </div>
  );
};
