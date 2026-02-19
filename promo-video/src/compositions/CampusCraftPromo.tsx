import React from "react";
import { Sequence } from "remotion";
import { McBackground } from "../components/McBackground";
import { Hook } from "../components/Hook";
import { AuthDemo } from "../components/AuthDemo";
import { UniversityShowcase } from "../components/UniversityShowcase";
import { CTA } from "../components/CTA";

// 씬 배치 (30fps 기준, 총 540프레임 = 18초)
// 각 씬 +1초(30프레임) 여유 추가 — 컷 전환 전 잔상 확보
// Hook:               0~105   (0~3.5초)
// AuthDemo:          105~270  (3.5~9초)
// UniversityShowcase: 270~420 (9~14초)
// CTA:               420~540  (14~18초)

export const CampusCraftPromo: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#1a1a2e",
        position: "relative",
      }}
    >
      {/* 전체 영상에 걸친 단일 배경 — 씬 전환 시 검은 화면 방지 */}
      <McBackground darken={0.55} />

      <Sequence from={0} durationInFrames={105} name="Hook">
        <Hook />
      </Sequence>

      <Sequence from={105} durationInFrames={165} name="AuthDemo">
        <AuthDemo />
      </Sequence>

      <Sequence from={270} durationInFrames={150} name="UniversityShowcase">
        <UniversityShowcase />
      </Sequence>

      <Sequence from={420} durationInFrames={210} name="CTA">
        <CTA />
      </Sequence>
    </div>
  );
};
