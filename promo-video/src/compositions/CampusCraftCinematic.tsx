import React from "react";
import {
  useCurrentFrame,
  interpolate,
  Easing,
  OffthreadVideo,
  Img,
  Audio,
  staticFile,
  Sequence,
} from "remotion";
import { universities } from "../data/universities";
import {
  MC_TITLE_FONT,
  MC_KR_FONT,
  MC,
  mcShadow,
  MC_NAMETAG_BG,
} from "../styles/fonts";
import { CinematicOverlay } from "../components/CinematicOverlay";

const smoothOut = Easing.out(Easing.cubic);
const smooth = Easing.bezier(0.25, 0.1, 0.25, 1);

function fadeIn(frame: number, start: number, dur = 20): number {
  return interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: smooth,
  });
}

function fadeOut(frame: number, start: number, dur = 15): number {
  return interpolate(frame, [start, start + dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: smooth,
  });
}

function slideUp(frame: number, start: number, dist = 40, dur = 25): number {
  return interpolate(frame, [start, start + dur], [dist, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: smoothOut,
  });
}

// 타이핑 데모 텍스트 계산
function getTypedText(
  frame: number,
  startFrame: number,
  text: string,
  charsPerFrame = 0.5
): string {
  const elapsed = Math.max(0, frame - startFrame);
  const chars = Math.min(text.length, Math.floor(elapsed * charsPerFrame));
  return text.slice(0, chars);
}

// 30초 = 900프레임 @ 30fps (여유 있는 템포)
// Scene 1: INTRO         0~160   (5.3s)  로고 + 스플래시 + 부제
// Scene 2: HOW IT WORKS  160~380 (7.3s)  사전등록 폼 데모
// Scene 3: FEATURES      380~540 (5.3s)  4개 피처 카드
// Scene 4: UNIVERSITIES  540~680 (4.7s)  대학 태그
// Scene 5: CTA           680~900 (7.3s)  오픈일 + CTA

const features = [
  { emoji: "🎓", title: "학교 이메일 인증", color: MC.AQUA },
  { emoji: "⚔️", title: "자동 팀 배정", color: MC.GREEN },
  { emoji: "🛡️", title: "팀 별 땅 보호", color: MC.GOLD },
  { emoji: "🔒", title: "대학생 전용", color: MC.RED },
];

const steps = [
  { text: "student@snu.ac.kr", color: MC.AQUA, label: "이메일 입력" },
  { text: "snu.ac.kr → 서울대학교", color: MC.GOLD, label: "학교 인증" },
  {
    text: "[SNU] 서울대학교 팀 합류!",
    color: MC.GREEN,
    label: "팀 배정 완료",
  },
];

export const CampusCraftCinematic: React.FC = () => {
  const frame = useCurrentFrame();

  // 배경 Ken Burns
  const bgScale = interpolate(frame, [0, 900], [1.0, 1.3], {
    easing: Easing.linear,
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 배경 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${bgScale})`,
          transformOrigin: "center center",
        }}
      >
        <OffthreadVideo
          src={staticFile("mc-bg.mov")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          muted
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.55)",
          }}
        />
      </div>

      {/* === Scene 1: INTRO (0~160) === */}
      <Sequence from={0} durationInFrames={160} name="Intro">
        <SceneIntro />
      </Sequence>

      {/* === Scene 2: HOW IT WORKS (160~380) === */}
      <Sequence from={160} durationInFrames={220} name="HowItWorks">
        <SceneHowItWorks />
      </Sequence>

      {/* === Scene 3: FEATURES (380~540) === */}
      <Sequence from={380} durationInFrames={160} name="Features">
        <SceneFeatures />
      </Sequence>

      {/* === Scene 4: UNIVERSITIES (540~680) === */}
      <Sequence from={540} durationInFrames={140} name="Universities">
        <SceneUniversities />
      </Sequence>

      {/* === Scene 5: CTA (680~900) === */}
      <Sequence from={680} durationInFrames={220} name="CTA">
        <SceneCTA />
      </Sequence>

      {/* === 효과음 (마크 원본) === */}

      {/* 폼 타이핑 — 이메일 (scene2 frame 35~ = global 195~) */}
      {Array.from({ length: 19 }, (_, i) => 195 + Math.floor(i / 0.35)).map(
        (f, i) => (
          <Sequence key={`type-e-${i}`} from={f} durationInFrames={10}>
            <Audio src={staticFile("sfx-click.ogg")} volume={0.25} />
          </Sequence>
        )
      )}

      {/* 폼 타이핑 — 닉네임 (scene2 frame 95~ = global 255~) */}
      {Array.from({ length: 5 }, (_, i) => 255 + Math.floor(i / 0.25)).map(
        (f, i) => (
          <Sequence key={`type-n-${i}`} from={f} durationInFrames={10}>
            <Audio src={staticFile("sfx-click.ogg")} volume={0.25} />
          </Sequence>
        )
      )}

      {/* 버튼 클릭 (scene2 frame 118 = global 278) */}
      <Sequence from={278} durationInFrames={10}>
        <Audio src={staticFile("sfx-click.ogg")} volume={0.5} />
      </Sequence>

      {/* 토스트 등장 (scene2 frame 140 = global 300) */}
      <Sequence from={300} durationInFrames={48}>
        <Audio src={staticFile("sfx-toast.ogg")} volume={0.6} />
      </Sequence>

      {/* 도전과제 달성 사운드 (global 302) — 6.8초 풀 재생 */}
      <Sequence from={302} durationInFrames={204}>
        <Audio src={staticFile("sfx-achievement.ogg")} volume={0.5} />
      </Sequence>

      {/* 경험치 구슬 — 대학 태그 등장 시 (global 558~) */}
      {Array.from({ length: 6 }, (_, i) => 558 + i * 15).map((f, i) => (
        <Sequence key={`orb-${i}`} from={f} durationInFrames={24}>
          <Audio src={staticFile("sfx-orb.ogg")} volume={0.2} />
        </Sequence>
      ))}

      {/* 레벨업 — CTA 등장 (global 685) */}
      <Sequence from={685} durationInFrames={54}>
        <Audio src={staticFile("sfx-levelup.ogg")} volume={0.4} />
      </Sequence>

      <CinematicOverlay />
    </div>
  );
};

// ─── Scene 1: Intro ───
const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();

  const logoOpacity = fadeIn(frame, 10, 30);
  const logoScale = interpolate(frame, [10, 40], [0.92, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: smoothOut,
  });
  const logoFadeOut = frame > 125 ? fadeOut(frame, 125, 25) : 1;

  const splashOpacity = fadeIn(frame, 38, 18);
  const splashFadeOut = frame > 125 ? fadeOut(frame, 125, 25) : 1;

  const subOpacity = fadeIn(frame, 55, 22);
  const subY = slideUp(frame, 55, 25, 22);
  const subFadeOut = frame > 125 ? fadeOut(frame, 125, 25) : 1;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 로고 이미지 */}
      <div
        style={{
          position: "relative",
          opacity: logoOpacity * logoFadeOut,
          transform: `scale(${logoScale})`,
          marginBottom: -30,
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 550,
            height: "auto",
            transform: "scaleY(0.5)",
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.6))",
          }}
        />

        {/* 스플래시 텍스트 */}
        <div
          style={{
            position: "absolute",
            right: -20,
            bottom: "28%",
            fontFamily: MC_KR_FONT,
            fontSize: 22,
            fontWeight: "bold",
            color: "#FFFF00",
            textShadow: "2px 2px 0px #3F3F00",
            opacity: splashOpacity * splashFadeOut,
            transform: "rotate(-15deg)",
            whiteSpace: "nowrap",
          }}
        >
          새 학기엔 CC하자!
        </div>
      </div>

      {/* 부제 */}
      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 26,
          color: MC.GRAY,
          textShadow: mcShadow(MC.GRAY),
          opacity: subOpacity * subFadeOut,
          transform: `translateY(${subY}px)`,
          letterSpacing: 3,
          marginTop: 20,
        }}
      >
        대학생 전용 마인크래프트 서버
      </div>
    </div>
  );
};

// ─── Scene 2: How It Works (사전등록 폼 데모) ───
const SceneHowItWorks: React.FC = () => {
  const frame = useCurrentFrame();

  const allFadeOut = frame > 190 ? fadeOut(frame, 190, 22) : 1;
  const titleOpacity = fadeIn(frame, 5, 22) * allFadeOut;
  const titleY = slideUp(frame, 5, 30, 22);

  // Phase 1: 폼 입력 (0~125)
  const showForm = frame < 125;
  // Phase 2: 성공 화면 (125~)
  const showSuccess = frame >= 125;

  // 폼 등장
  const formOpacity = fadeIn(frame, 18, 20) * allFadeOut;

  // 이메일 타이핑 (frame 35~) — 느리게
  const emailText = "student@korea.ac.kr";
  const typedEmail = getTypedText(frame, 35, emailText, 0.35);
  const emailCursor =
    frame >= 35 &&
    typedEmail.length < emailText.length &&
    Math.floor(frame / 8) % 2 === 0;

  // 닉네임 타이핑 (frame 95~) — 느리게
  const nicknameText = "Steve";
  const typedNickname = getTypedText(frame, 95, nicknameText, 0.25);
  const nicknameCursor =
    frame >= 95 &&
    typedNickname.length < nicknameText.length &&
    Math.floor(frame / 8) % 2 === 0;

  // 버튼 활성화 (frame 108~)
  const btnGlow =
    frame >= 108 && frame < 120
      ? interpolate(frame, [108, 115], [0, 1], {
          extrapolateRight: "clamp",
          extrapolateLeft: "clamp",
          easing: smoothOut,
        })
      : 0;

  // 버튼 눌림 (frame 118~122)
  const btnPressed = frame >= 118 && frame < 125;

  // 성공 화면
  const successOpacity = showSuccess ? fadeIn(frame, 130, 22) * allFadeOut : 0;
  const successY = showSuccess ? slideUp(frame, 130, 30, 22) : 30;

  // 토스트
  const toastOpacity = showSuccess ? fadeIn(frame, 140, 18) * allFadeOut : 0;
  const toastY = showSuccess
    ? interpolate(frame, [140, 160], [-60, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: smoothOut,
      })
    : -60;

  // MC 인풋 스타일
  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    border: "2px solid #555",
    borderTopColor: "#1a1a1a",
    borderLeftColor: "#1a1a1a",
    fontFamily: MC_KR_FONT,
    fontSize: 18,
    color: MC.WHITE,
    boxSizing: "border-box",
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
        position: "relative",
      }}
    >
      {/* 타이틀 */}
      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 32,
          color: MC.GREEN,
          textShadow: `0 0 15px rgba(85,255,85,0.2), ${mcShadow(MC.GREEN)}`,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 15,
          letterSpacing: 3,
        }}
      >
        어떻게 참여하나요?
      </div>

      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 18,
          color: MC.GRAY,
          textShadow: mcShadow(MC.GRAY),
          opacity: titleOpacity,
          marginBottom: 30,
        }}
      >
        아래 폼에서 사전신청 → 메일 인증 끝!
      </div>

      {/* 폼 카드 */}
      {showForm && (
        <div
          style={{
            width: 620,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255,255,255,0.05)",
            padding: "30px 35px",
            opacity: formOpacity,
          }}
        >
          {/* 사전 신청 헤더 */}
          <div
            style={{
              fontFamily: MC_KR_FONT,
              fontSize: 24,
              color: MC.GOLD,
              textShadow: mcShadow(MC.GOLD),
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            사전 신청
          </div>
          <div
            style={{
              fontFamily: MC_KR_FONT,
              fontSize: 13,
              color: MC.GRAY,
              textAlign: "center",
              marginBottom: 25,
            }}
          >
            사전신청 시 우선 알림 + 학교별 과잠 갑옷 지급
          </div>

          {/* 이메일 필드 */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontFamily: MC_KR_FONT,
                fontSize: 13,
                color: MC.GRAY,
                marginBottom: 6,
              }}
            >
              대학교 이메일
            </div>
            <div style={inputStyle}>
              {typedEmail.length > 0 ? (
                <span>{typedEmail}</span>
              ) : (
                <span style={{ color: "#555" }}>student@university.ac.kr</span>
              )}
              {emailCursor && <span>_</span>}
            </div>
          </div>

          {/* 닉네임 필드 */}
          <div style={{ marginBottom: 22 }}>
            <div
              style={{
                fontFamily: MC_KR_FONT,
                fontSize: 13,
                color: MC.GRAY,
                marginBottom: 6,
              }}
            >
              마인크래프트 닉네임
            </div>
            <div style={inputStyle}>
              {typedNickname.length > 0 ? (
                <span>{typedNickname}</span>
              ) : (
                <span style={{ color: "#555" }}>Steve</span>
              )}
              {nicknameCursor && <span>_</span>}
            </div>
          </div>

          {/* 초록 버튼 */}
          <div
            style={{
              width: "100%",
              padding: "14px 0",
              textAlign: "center",
              fontFamily: MC_KR_FONT,
              fontSize: 20,
              color: MC.WHITE,
              textShadow: "2px 2px 0px rgba(0,0,0,0.5)",
              background: btnPressed
                ? "linear-gradient(180deg, #2a5d0e 0%, #3a6d1e 50%, #4a7d2e 100%)"
                : "linear-gradient(180deg, #4a7d2e 0%, #3a6d1e 50%, #3a6d1e 100%)",
              borderTop: btnPressed
                ? "3px solid #1a3a0a"
                : "3px solid #6aad3e",
              borderLeft: btnPressed
                ? "3px solid #1a3a0a"
                : "3px solid #6aad3e",
              borderBottom: btnPressed
                ? "3px solid #6aad3e"
                : "3px solid #1a3a0a",
              borderRight: btnPressed
                ? "3px solid #6aad3e"
                : "3px solid #1a3a0a",
              boxShadow:
                btnGlow > 0
                  ? `0 0 ${btnGlow * 15}px rgba(85,255,85,${btnGlow * 0.3})`
                  : "none",
              letterSpacing: 2,
            }}
          >
            {frame >= 118 ? "신청 중..." : "사전 신청하기"}
          </div>
        </div>
      )}

      {/* 성공 화면 */}
      {showSuccess && (
        <div
          style={{
            width: 620,
            textAlign: "center",
            padding: "35px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(85,255,85,0.2)",
            opacity: successOpacity,
            transform: `translateY(${successY}px)`,
          }}
        >
          <div
            style={{
              fontFamily: MC_KR_FONT,
              fontSize: 26,
              color: MC.GREEN,
              textShadow: mcShadow(MC.GREEN),
              marginBottom: 12,
            }}
          >
            인증 이메일을 확인해주세요!
          </div>
          <div
            style={{
              fontFamily: MC_KR_FONT,
              fontSize: 20,
              color: MC.AQUA,
              textShadow: mcShadow(MC.AQUA),
              marginBottom: 18,
            }}
          >
            고려대학교 팀으로 배정될 예정입니다
          </div>
          <div
            style={{
              fontFamily: MC_KR_FONT,
              fontSize: 14,
              color: MC.GRAY,
            }}
          >
            입력하신 이메일로 인증 링크를 보내드렸습니다.
          </div>
        </div>
      )}

      {/* 토스트 알림 — "도전 과제 달성!" */}
      {showSuccess && (
        <div
          style={{
            position: "absolute",
            top: 180,
            right: 60,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "14px 18px",
            backgroundColor: "#3a3a3a",
            border: "2px solid #1a1a1a",
            borderTopColor: "#6a6a6a",
            borderLeftColor: "#6a6a6a",
            boxShadow: "4px 4px 0 rgba(0,0,0,0.5)",
            opacity: toastOpacity,
            transform: `translateY(${toastY}px)`,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              backgroundColor: "rgba(85,255,255,0.15)",
              border: "1px solid rgba(85,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            💎
          </div>
          <div>
            <div
              style={{
                fontFamily: MC_KR_FONT,
                fontSize: 13,
                color: MC.YELLOW,
              }}
            >
              도전 과제 달성!
            </div>
            <div
              style={{
                fontFamily: MC_KR_FONT,
                fontSize: 16,
                color: MC.WHITE,
                marginTop: 2,
              }}
            >
              인증 이메일을 확인해주세요!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Scene 3: Features ───
const SceneFeatures: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fadeIn(frame, 5, 22);
  const titleY = slideUp(frame, 5, 30, 22);
  const allFadeOut = frame > 130 ? fadeOut(frame, 130, 22) : 1;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 32,
          color: MC.GOLD,
          textShadow: `0 0 15px rgba(255,170,0,0.2), ${mcShadow(MC.GOLD)}`,
          opacity: titleOpacity * allFadeOut,
          transform: `translateY(${titleY}px)`,
          marginBottom: 45,
          letterSpacing: 3,
        }}
      >
        왜 CampusCraft인가?
      </div>

      {/* 피처 카드 그리드 — 2x2 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          width: 700,
          padding: "0 30px",
        }}
      >
        {features.map((feat, i) => {
          const cardDelay = 28 + i * 20;
          const cardOpacity = fadeIn(frame, cardDelay, 20) * allFadeOut;
          const cardY = slideUp(frame, cardDelay, 25, 20);

          return (
            <div
              key={i}
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderLeft: `3px solid ${feat.color}`,
                padding: "20px 22px",
                opacity: cardOpacity,
                transform: `translateY(${cardY}px)`,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>{feat.emoji}</div>
              <div
                style={{
                  fontFamily: MC_KR_FONT,
                  fontSize: 20,
                  color: feat.color,
                  textShadow: mcShadow(feat.color),
                }}
              >
                {feat.title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Scene 4: Universities ───
const SceneUniversities: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fadeIn(frame, 5, 22);
  const titleY = slideUp(frame, 5, 30, 22);
  const allFadeOut = frame > 110 ? fadeOut(frame, 110, 22) : 1;

  const countTarget = Math.min(
    30,
    Math.floor(
      interpolate(frame, [20, 80], [0, 30], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    )
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 32,
          color: MC.AQUA,
          textShadow: `0 0 15px rgba(85,255,255,0.2), ${mcShadow(MC.AQUA)}`,
          opacity: titleOpacity * allFadeOut,
          transform: `translateY(${titleY}px)`,
          marginBottom: 35,
          letterSpacing: 3,
        }}
      >
        참여 가능 대학교
      </div>

      {/* 태그들 */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 10,
          maxWidth: 920,
          padding: "0 25px",
          opacity: allFadeOut,
        }}
      >
        {universities.map((uni, i) => {
          const tagDelay = 15 + i * 2.2;
          const tagOpacity = fadeIn(frame, tagDelay, 12);
          const tagY = slideUp(frame, tagDelay, 18, 12);

          return (
            <div
              key={uni.id}
              style={{
                backgroundColor: MC_NAMETAG_BG,
                padding: "6px 10px",
                fontFamily: MC_TITLE_FONT,
                fontSize: 13,
                color: uni.colorHex,
                textShadow: mcShadow(uni.colorHex),
                opacity: tagOpacity,
                transform: `translateY(${tagY}px)`,
                whiteSpace: "nowrap",
              }}
            >
              [{uni.tag}]
            </div>
          );
        })}
      </div>

      {/* 카운터 */}
      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 22,
          color: MC.GRAY,
          textShadow: mcShadow(MC.GRAY),
          marginTop: 25,
          opacity: fadeIn(frame, 25, 20) * allFadeOut,
          letterSpacing: 2,
        }}
      >
        현재{" "}
        <span style={{ color: MC.WHITE, fontSize: 28 }}>{countTarget}</span>
        개 대학 지원 · 계속 추가 중
      </div>
    </div>
  );
};

// ─── Scene 5: CTA ───
const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();

  // 오픈일 배지
  const badgeOpacity = fadeIn(frame, 8, 25);
  const badgeY = slideUp(frame, 8, 30, 25);

  // 로고
  const logoOpacity = fadeIn(frame, 40, 28);
  const logoScale = interpolate(frame, [40, 68], [0.92, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: smoothOut,
  });

  // 버튼
  const btnOpacity = fadeIn(frame, 75, 25);
  const btnY = slideUp(frame, 75, 25, 25);
  // 버튼 펄스 (커졌다 작아졌다)
  const btnPulse =
    frame > 105
      ? interpolate(Math.sin((frame - 105) * 0.15), [-1, 1], [0.93, 1.07])
      : 1;

  // 전체 페이드아웃 (마지막 22프레임)
  const endFade = frame > 196 ? fadeOut(frame, 196, 22) : 1;

  // URL
  const urlOpacity = fadeIn(frame, 105, 22);
  const urlGlow =
    frame > 120
      ? interpolate(Math.sin((frame - 120) * 0.12), [-1, 1], [0.3, 0.8])
      : 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 오픈일 배지 — 웹사이트 스타일 */}
      <div
        style={{
          fontFamily: MC_KR_FONT,
          fontSize: 24,
          color: MC.GREEN,
          textShadow: `1px 1px 0px rgba(0,80,0,0.5), 0 0 10px rgba(85,255,85,0.15)`,
          border: `1px solid rgba(85,255,85,0.4)`,
          backgroundColor: "rgba(85,255,85,0.08)",
          padding: "10px 28px",
          opacity: badgeOpacity * endFade,
          transform: `translateY(${badgeY}px)`,
          letterSpacing: 2,
          marginBottom: 35,
        }}
      >
        3월 3일 서버 오픈 예정!
      </div>

      {/* 로고 */}
      <div
        style={{
          opacity: logoOpacity * endFade,
          transform: `scale(${logoScale})`,
          marginBottom: 35,
        }}
      >
        <Img
          src={staticFile("logo.png")}
          style={{
            width: 480,
            height: "auto",
            transform: "scaleY(0.5)",
            filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.6))",
          }}
        />
      </div>

      {/* MC 돌 버튼 — 웹사이트 스타일 */}
      <div
        style={{
          background:
            "linear-gradient(180deg, #6d6d6d 0%, #4a4a4a 45%, #3a3a3a 55%, #4a4a4a 100%)",
          border: "3px solid #1a1a1a",
          borderTop: "3px solid #8a8a8a",
          borderLeft: "3px solid #8a8a8a",
          padding: "14px 40px",
          fontFamily: MC_KR_FONT,
          fontSize: 24,
          color: MC.WHITE,
          textShadow: mcShadow(MC.WHITE),
          letterSpacing: 2,
          opacity: btnOpacity * endFade,
          transform: `translateY(${btnY}px) scale(${btnPulse})`,
          marginBottom: 30,
        }}
      >
        사전 신청 시작
      </div>

      {/* URL */}
      <div
        style={{
          fontFamily: MC_TITLE_FONT,
          fontSize: 22,
          color: MC.AQUA,
          textShadow: `0 0 ${10 + urlGlow * 20}px rgba(85,255,255,${urlGlow}), ${mcShadow(MC.AQUA)}`,
          opacity: urlOpacity * endFade,
          letterSpacing: 2,
        }}
      >
        campuscraft.xyz
      </div>
    </div>
  );
};
