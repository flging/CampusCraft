import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { universities } from "../data/universities";
import { MC_TITLE_FONT, MC_KR_FONT, MC, mcShadow, MC_NAMETAG_BG } from "../styles/fonts";

export const UniversityShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 점점 빨라지는 등장 타이밍 — 30개 태그를 ~90프레임 안에 모두 표시
  const getDelay = (index: number): number => {
    let total = 5;
    for (let i = 0; i < index; i++) {
      const interval = Math.max(1.5, 5 - i * 0.13);
      total += interval;
    }
    return total;
  };

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
      {/* 상단 텍스트 */}
      <div
        style={{
          position: "relative",
          fontFamily: MC_KR_FONT,
          fontSize: 28,
          color: MC.GRAY,
          marginBottom: 30,
          letterSpacing: 2,
          textShadow: mcShadow(MC.GRAY),
          opacity: interpolate(frame, [0, 12], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        전국 30개 대학 참여가능
      </div>

      {/* 태그 그리드 — 마크 네임태그 스타일 (반투명 검정 배경 + 팀 색상 텍스트) */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 10,
          maxWidth: 920,
          padding: "0 30px",
        }}
      >
        {universities.map((uni, i) => {
          const delay = getDelay(i);
          const scale = spring({
            frame: Math.max(0, frame - delay),
            fps,
            config: { damping: 10, stiffness: 180, mass: 0.5 },
          });

          return (
            <div
              key={uni.id}
              style={{
                transform: `scale(${scale})`,
                backgroundColor: MC_NAMETAG_BG,
                padding: "6px 10px",
                fontSize: 14,
                color: uni.colorHex,
                textShadow: mcShadow(uni.colorHex),
                letterSpacing: 1,
                whiteSpace: "nowrap",
              }}
            >
              [{uni.tag}]
            </div>
          );
        })}
      </div>
    </div>
  );
};
