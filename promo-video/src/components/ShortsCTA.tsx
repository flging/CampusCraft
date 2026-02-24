import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { universities } from "../data/universities";
import {
  MC_TITLE_FONT,
  MC_KR_FONT,
  MC,
  mcShadow,
  MC_NAMETAG_BG,
} from "../styles/fonts";
import { zoomPunch, screenShake, quickFadeIn } from "../effects";

export const ShortsCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: 대학 태그 폭발 (0~40)
  const tagsPhase = frame < 50;

  // Phase 2: CTA (50~)
  const ctaFrame = Math.max(0, frame - 50);

  // 카운터 (0~30까지 빠르게)
  const countTarget = Math.min(
    34,
    Math.floor(interpolate(frame, [5, 35], [0, 34], { extrapolateRight: "clamp", extrapolateLeft: "clamp" }))
  );

  // CTA 요소들
  const dateScale = zoomPunch(ctaFrame, fps, 3, 1.4);
  const dateOpacity = quickFadeIn(ctaFrame, 3, 4);
  const dateShake = screenShake(ctaFrame, 3, 6, 15, "cta-date");

  const linkOpacity = quickFadeIn(ctaFrame, 18, 5);
  const linkScale = zoomPunch(ctaFrame, fps, 18, 1.15);

  // 화살표 펄스
  const arrowPulse = ctaFrame > 28
    ? interpolate(Math.sin((ctaFrame - 28) * 0.3), [-1, 1], [0.85, 1.15])
    : 0;
  const arrowOpacity = quickFadeIn(ctaFrame, 28, 5);

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
      {/* Phase 1: 대학 태그 폭발 */}
      {tagsPhase && (
        <>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
              maxWidth: 950,
              padding: "0 20px",
              marginBottom: 30,
            }}
          >
            {universities.map((uni, i) => {
              const tagScale = spring({
                frame: Math.max(0, frame - 2 - i * 0.8),
                fps,
                config: { damping: 8, stiffness: 250, mass: 0.4 },
              });

              return (
                <div
                  key={uni.id}
                  style={{
                    transform: `scale(${tagScale})`,
                    backgroundColor: MC_NAMETAG_BG,
                    padding: "5px 8px",
                    fontSize: 13,
                    color: uni.colorHex,
                    textShadow: mcShadow(uni.colorHex),
                    fontFamily: MC_TITLE_FONT,
                    whiteSpace: "nowrap",
                  }}
                >
                  [{uni.tag}]
                </div>
              );
            })}
          </div>

          <div
            style={{
              fontFamily: MC_KR_FONT,
              fontSize: 44,
              color: MC.GOLD,
              textShadow: mcShadow(MC.GOLD),
              textAlign: "center",
            }}
          >
            <span
              style={{
                fontSize: 60,
                color: MC.WHITE,
                textShadow: mcShadow(MC.WHITE),
              }}
            >
              {countTarget}
            </span>
            개 대학 참전 중
          </div>
        </>
      )}

      {/* Phase 2: CTA */}
      {!tagsPhase && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: `translate(${dateShake.x}px, ${dateShake.y}px)`,
          }}
        >
          {/* 3월 3일 오픈 */}
          <div
            style={{
              fontFamily: MC_KR_FONT,
              fontSize: 72,
              color: MC.RED,
              textShadow: mcShadow(MC.RED),
              transform: `scale(${dateScale})`,
              opacity: dateOpacity,
              marginBottom: 20,
            }}
          >
            3.3 오픈
          </div>

          {/* 사전신청 */}
          <div
            style={{
              fontFamily: MC_KR_FONT,
              fontSize: 34,
              color: MC.WHITE,
              textShadow: mcShadow(MC.WHITE),
              transform: `scale(${linkScale})`,
              opacity: linkOpacity,
              marginBottom: 30,
            }}
          >
            사전신청은 프로필 링크
          </div>

          {/* 아래 화살표 */}
          <div
            style={{
              fontFamily: MC_KR_FONT,
              fontSize: 60,
              color: MC.GOLD,
              transform: `scale(${arrowPulse})`,
              opacity: arrowOpacity,
            }}
          >
            👇
          </div>
        </div>
      )}
    </div>
  );
};
