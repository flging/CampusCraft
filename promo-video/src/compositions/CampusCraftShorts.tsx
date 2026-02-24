import React from "react";
import { useCurrentFrame, Sequence } from "remotion";
import { McBackground } from "../components/McBackground";
import { ShortsHook } from "../components/ShortsHook";
import { ShortsProblem } from "../components/ShortsProblem";
import { ShortsReveal } from "../components/ShortsReveal";
import { ShortsFeatures } from "../components/ShortsFeatures";
import { ShortsCTA } from "../components/ShortsCTA";
import { flashIntensity } from "../effects";

// 숏츠 스타일 — 15초 (450프레임 @ 30fps)
// Hook:        0~60    (2초)   "너 대학생이야?"
// Flash:       60
// Problem:     60~120  (2초)   "마크 같이 할 사람 없지?"
// Flash:       120
// Reveal:      120~210 (3초)   CampusCraft 로고 + 설명
// Flash:       210
// Features:    210~315 (3.5초) 3비트 피처
// Flash:       315
// CTA:         315~450 (4.5초) 대학 폭발 + 오픈일 + CTA

export const CampusCraftShorts: React.FC = () => {
  const frame = useCurrentFrame();

  // 플래시 타이밍
  const flash =
    Math.max(
      flashIntensity(frame, 58, 4),
      flashIntensity(frame, 118, 4),
      flashIntensity(frame, 208, 4),
      flashIntensity(frame, 313, 4)
    );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#1a1a2e",
        position: "relative",
      }}
    >
      <McBackground darken={0.6} />

      <Sequence from={0} durationInFrames={62} name="Hook">
        <ShortsHook />
      </Sequence>

      <Sequence from={60} durationInFrames={62} name="Problem">
        <ShortsProblem />
      </Sequence>

      <Sequence from={120} durationInFrames={92} name="Reveal">
        <ShortsReveal />
      </Sequence>

      <Sequence from={210} durationInFrames={107} name="Features">
        <ShortsFeatures />
      </Sequence>

      <Sequence from={315} durationInFrames={135} name="CTA">
        <ShortsCTA />
      </Sequence>

      {/* 플래시 오버레이 */}
      {flash > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: `rgba(255, 255, 255, ${flash * 0.85})`,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};
