import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {
  MC_TITLE_FONT,
  MC_CHAT_FONT,
  MC_KR_FONT,
  MC,
  mcShadow,
  MC_NAMETAG_BG,
} from "../styles/fonts";

export const AuthDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: 폼 카드 등장 (0~10)
  const formScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 150 },
  });
  const formOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Phase 2: 이메일 타이핑 (10~50)
  const email = "student@korea.ac.kr";
  const typedChars = Math.min(
    Math.floor(
      interpolate(frame, [10, 48], [0, email.length], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    ),
    email.length
  );
  const typedEmail = email.slice(0, typedChars);
  const cursorVisible = Math.floor(frame / 12) % 2 === 0;
  const typingDone = typedChars >= email.length;

  // Phase 3: 폼 축소 + 화살표 전환 (52~72)
  const formShrink = interpolate(frame, [52, 62], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowOpacity = interpolate(frame, [56, 63], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowFade = interpolate(frame, [70, 78], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Phase 4: 결과 네임태그 (75~)
  const showResult = frame >= 75;
  const resultScale = spring({
    frame: Math.max(0, frame - 75),
    fps,
    config: { damping: 10, stiffness: 100 },
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
      {/* Phase 1-2: 이메일 입력 폼 */}
      {frame < 65 && (
        <div
          style={{
            position: "relative",
            opacity: formOpacity * formShrink,
            transform: `scale(${formScale * formShrink})`,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            border: "3px solid rgba(255, 255, 255, 0.15)",
            borderTop: "3px solid rgba(255, 255, 255, 0.25)",
            padding: "32px 30px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            width: 440,
          }}
        >
          <div
            style={{
              fontFamily: MC_KR_FONT,
              fontSize: 20,
              color: MC.GREEN,
              textShadow: mcShadow(MC.GREEN),
              letterSpacing: 2,
              marginBottom: 4,
            }}
          >
            학교 이메일 인증
          </div>

          <div
            style={{
              width: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              border: "2px solid rgba(128, 128, 128, 0.4)",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: MC_CHAT_FONT,
                color: MC.WHITE,
                fontSize: 20,
                textShadow: mcShadow(MC.WHITE),
              }}
            >
              {typedEmail}
            </span>
            <span
              style={{
                opacity: cursorVisible && !typingDone ? 1 : 0,
                fontFamily: MC_CHAT_FONT,
                color: MC.GREEN,
                fontSize: 20,
              }}
            >
              |
            </span>
          </div>
        </div>
      )}

      {/* Phase 3: 화살표 전환 */}
      {frame >= 56 && frame < 82 && (
        <div
          style={{
            position: "absolute",
            opacity: arrowOpacity * arrowFade,
            fontFamily: MC_TITLE_FONT,
            fontSize: 48,
            color: MC.GOLD,
            textShadow: mcShadow(MC.GOLD),
          }}
        >
          →
        </div>
      )}

      {/* Phase 4: 설명 + 마크 네임태그 */}
      {showResult && (
        <div
          style={{
            position: "relative",
            transform: `scale(${resultScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              fontFamily: MC_KR_FONT,
              fontSize: 22,
              color: MC.GRAY,
              textShadow: mcShadow(MC.GRAY),
              textAlign: "center",
            }}
          >
            학교별 태그 자동 부여
          </div>
          <div
            style={{
              backgroundColor: MC_NAMETAG_BG,
              padding: "8px 12px",
              display: "flex",
              alignItems: "baseline",
              gap: 0,
              fontFamily: MC_TITLE_FONT,
              fontSize: 36,
              letterSpacing: 2,
            }}
          >
            <span
              style={{
                color: MC.RED,
                textShadow: mcShadow(MC.RED),
              }}
            >
              [KOREA]{" "}
            </span>
            <span
              style={{
                color: MC.WHITE,
                textShadow: mcShadow(MC.WHITE),
              }}
            >
              Steve
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
