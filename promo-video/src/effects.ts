import { spring, interpolate, random } from "remotion";

// 줌 펀치 — 0에서 overshoot 후 1로 안착
export function zoomPunch(
  frame: number,
  fps: number,
  delay: number = 0,
  overshoot: number = 1.3
): number {
  const f = Math.max(0, frame - delay);
  const s = spring({
    frame: f,
    fps,
    config: { damping: 8, stiffness: 300, mass: 0.6 },
  });
  // overshoot: 1 이상으로 갔다가 1로 돌아옴
  if (s < 1) {
    return interpolate(s, [0, 1], [0, overshoot]);
  }
  const settle = spring({
    frame: Math.max(0, f - 4),
    fps,
    config: { damping: 15, stiffness: 200 },
  });
  return interpolate(settle, [0, 1], [overshoot, 1]);
}

// 스크린 쉐이크 — 프레임 구간 동안 랜덤 오프셋
export function screenShake(
  frame: number,
  startFrame: number,
  duration: number = 5,
  intensity: number = 12,
  seed: string = "shake"
): { x: number; y: number } {
  if (frame < startFrame || frame >= startFrame + duration) {
    return { x: 0, y: 0 };
  }
  const progress = (frame - startFrame) / duration;
  const decay = 1 - progress;
  return {
    x: random(`${seed}-x-${frame}`) * intensity * 2 * decay - intensity * decay,
    y: random(`${seed}-y-${frame}`) * intensity * 2 * decay - intensity * decay,
  };
}

// 빠른 팝인 opacity
export function quickFadeIn(
  frame: number,
  delay: number = 0,
  duration: number = 5
): number {
  return interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// 플래시 (흰색 번쩍) 강도
export function flashIntensity(
  frame: number,
  triggerFrame: number,
  duration: number = 4
): number {
  if (frame < triggerFrame || frame >= triggerFrame + duration) return 0;
  const progress = (frame - triggerFrame) / duration;
  return 1 - progress;
}
