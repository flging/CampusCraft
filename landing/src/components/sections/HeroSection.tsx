"use client";

import MinecraftButton from "@/components/ui/MinecraftButton";

export default function HeroSection() {
  const scrollToForm = () => {
    document.getElementById("pre-register")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* CSS 플로팅 블록 배경 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-8 h-8 md:w-12 md:h-12 opacity-10 ${
              i % 2 === 0 ? "animate-float" : "animate-float-delayed"
            }`}
            style={{
              left: `${(i * 8.3) % 100}%`,
              top: `${(i * 13.7 + 5) % 90}%`,
              background: `linear-gradient(135deg, ${
                ["#6d6d6d", "#8B4513", "#228B22", "#4a4a4a", "#1a6b1a", "#555555"][i % 6]
              } 0%, ${
                ["#4a4a4a", "#654321", "#1a5a1a", "#3a3a3a", "#0a4a0a", "#3a3a3a"][i % 6]
              } 100%)`,
              imageRendering: "pixelated",
            }}
          />
        ))}
      </div>

      {/* 메인 콘텐츠 — CSS 애니메이션 */}
      <div className="relative z-10 text-center animate-[fadeInUp_0.8s_ease-out_forwards]">
        {/* 로고 텍스트 */}
        <h1
          className="font-title text-3xl sm:text-4xl md:text-6xl text-white tracking-wider mb-2 animate-[scaleIn_0.6s_ease-out_0.2s_both]"
          style={{
            textShadow: [
              "-2px -2px 0px #555555",
              "2px -2px 0px #555555",
              "-2px 2px 0px #555555",
              "2px 2px 0px #555555",
              "3px 3px 0px #444444",
              "4px 4px 0px #333333",
              "5px 5px 0px #222222",
              "6px 8px 6px rgba(0,0,0,0.5)",
            ].join(", "),
          }}
        >
          CampusCraft
        </h1>

        {/* 훅 텍스트 */}
        <p
          className="font-pixel text-mc-gold text-2xl sm:text-3xl md:text-5xl mt-6 md:mt-8 animate-[fadeInUp_0.5s_ease-out_0.6s_both]"
          style={{ textShadow: "2px 2px 0px rgb(63, 42, 0)" }}
        >
          CC할 사람!
        </p>

        {/* 부제 */}
        <p
          className="font-pixel text-mc-gray text-sm md:text-base mt-4 md:mt-6 tracking-wide animate-[fadeIn_0.5s_ease-out_0.9s_both]"
          style={{ textShadow: "2px 2px 0px rgb(42, 42, 42)" }}
        >
          대학생 전용 마인크래프트 서버
        </p>

        {/* 오픈일 안내 */}
        <div className="mt-6 md:mt-8 animate-[scaleIn_0.5s_ease-out_1s_both]">
          <span className="inline-block font-pixel text-mc-green text-sm md:text-lg px-4 py-2 border border-mc-green/40 bg-mc-green/10"
            style={{ textShadow: "1px 1px 0px rgba(0,80,0,0.5)" }}
          >
            3월 3일 서버 오픈 확정!
          </span>
        </div>

        {/* CTA 버튼 */}
        <div className="mt-10 md:mt-14 animate-[scaleIn_0.4s_ease-out_1.2s_both]">
          <MinecraftButton size="lg" onClick={scrollToForm}>
            사전 신청 시작
          </MinecraftButton>
        </div>

        {/* 하단 스크롤 힌트 */}
        <div className="mt-16 md:mt-20 animate-[fadeIn_0.5s_ease-out_1.8s_both]">
          <p className="text-mc-dark-gray text-xs font-pixel animate-bounce">
            ▼ 스크롤하여 더 알아보기
          </p>
        </div>
      </div>
    </header>
  );
}
