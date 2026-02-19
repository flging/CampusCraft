import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { MC_KR_FONT, MC, mcShadow } from "../styles/fonts";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 텍스트 팝 애니메이션 — "탁" 등장
  const textScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: { damping: 10, stiffness: 200, mass: 0.8 },
  });

  const textOpacity = interpolate(frame, [3, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // CC → CampusCraft 전환 (프레임 38~46)
  const ccOpacity = interpolate(frame, [38, 44], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const campusCraftOpacity = interpolate(frame, [40, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const campusCraftBounce = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: { damping: 12, stiffness: 150 },
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 전체 픽셀 폰트 (Galmuri11 — 한글+영문) */}
      <div
        style={{
          position: "relative",
          transform: `scale(${textScale})`,
          opacity: textOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontFamily: MC_KR_FONT,
        }}
      >
        <div
          style={{
            fontSize: 44,
            color: MC.WHITE,
            textShadow: mcShadow(MC.WHITE),
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          <span style={{ color: MC.GRAY }}>&ldquo;</span>
          개강 전에
        </div>

        {/* CC → CampusCraft 전환 영역 */}
        <div
          style={{
            position: "relative",
            fontSize: 44,
            textAlign: "center",
            minHeight: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* CC (사라짐) */}
          <span
            style={{
              position: frame >= 40 ? "absolute" : "relative",
              opacity: ccOpacity,
              color: MC.WHITE,
              textShadow: mcShadow(MC.WHITE),
            }}
          >
            CC
          </span>

          {/* CampusCraft (등장) — C만 대문자 */}
          {frame >= 38 && (
            <span
              style={{
                opacity: campusCraftOpacity,
                transform: `scale(${campusCraftBounce})`,
                color: MC.WHITE,
                textShadow: mcShadow(MC.WHITE),
              }}
            >
              CampusCraft
            </span>
          )}
        </div>

        <div
          style={{
            fontSize: 44,
            color: MC.WHITE,
            textShadow: mcShadow(MC.WHITE),
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          해야지!
          <span style={{ color: MC.GRAY }}>&rdquo;</span>
        </div>
      </div>
    </div>
  );
};
