import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { MC_KR_FONT, MC, mcShadow } from "../styles/fonts";
import { zoomPunch, screenShake, quickFadeIn } from "../effects";

interface FeatureBeat {
  emoji: string;
  text: string;
  color: string;
  delay: number;
}

const beats: FeatureBeat[] = [
  { emoji: "📧", text: "학교 이메일 인증", color: MC.GREEN, delay: 0 },
  { emoji: "⚔️", text: "학교 팀 자동 배정", color: MC.AQUA, delay: 30 },
  { emoji: "🏆", text: "학교별 전용 부지!", color: MC.GOLD, delay: 60 },
];

export const ShortsFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 50,
      }}
    >
      {beats.map((beat, i) => {
        const beatFrame = frame - beat.delay;
        const isActive = beatFrame >= 0;
        const scale = isActive ? zoomPunch(beatFrame, fps, 0, 1.35) : 0;
        const opacity = isActive ? quickFadeIn(beatFrame, 0, 3) : 0;
        const shake = screenShake(frame, beat.delay, 5, 14, `feat-${i}`);

        // 이전 비트는 축소
        const nextBeatStarted = i < beats.length - 1 && frame >= beats[i + 1].delay + 5;
        const shrink = nextBeatStarted ? 0.7 : 1;
        const dimOpacity = nextBeatStarted ? 0.4 : 1;

        return (
          <div
            key={i}
            style={{
              fontFamily: MC_KR_FONT,
              fontSize: i === beats.length - 1 && isActive ? 56 : 48,
              color: beat.color,
              textShadow: mcShadow(beat.color),
              transform: `scale(${scale * shrink}) translate(${shake.x}px, ${shake.y}px)`,
              opacity: opacity * dimOpacity,
              textAlign: "center",
              transition: "opacity 0.1s",
            }}
          >
            {beat.emoji} {beat.text}
          </div>
        );
      })}
    </div>
  );
};
