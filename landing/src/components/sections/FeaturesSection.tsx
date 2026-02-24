"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";

const features = [
  {
    icon: "🎓",
    title: "학교 이메일 인증",
    description: "ac.kr 이메일 한 번이면 인증 끝. 진짜 대학생만 입장 가능.",
    color: "#55FFFF",
  },
  {
    icon: "⚔️",
    title: "자동 팀 배정",
    description: "이메일 도메인 기반으로 소속 대학교 팀에 자동 배정.",
    color: "#55FF55",
  },
  {
    icon: "🛡️",
    title: "학교별 전용 부지",
    description: "학교마다 전용 부지를 선착순 선택. 우리 학교만의 공간에서 자유롭게.",
    color: "#FFAA00",
  },
  {
    icon: "🔒",
    title: "대학생 전용",
    description: "인증된 대학생만 접속 가능. 안전하고 건전한 커뮤니티.",
    color: "#FF5555",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 px-4" aria-labelledby="features-heading">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <h2
            id="features-heading"
            className="font-pixel-bold text-mc-gold text-xl md:text-2xl text-center mb-4"
            style={{ textShadow: "2px 2px 0px rgb(63, 42, 0)" }}
          >
            왜 CampusCraft인가?
          </h2>
          <p className="text-mc-gray text-sm text-center mb-12 md:mb-16 font-pixel">
            마인크래프트 + 대학교 = 새로운 캠퍼스 라이프
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <ScrollReveal key={feature.title} delay={i * 0.1}>
              <div
                className="p-6 bg-black/20 border border-white/5 hover:border-white/10 transition-colors h-full"
                style={{
                  borderLeft: `3px solid ${feature.color}`,
                }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3
                  className="font-pixel-bold text-sm mb-2"
                  style={{
                    color: feature.color,
                    textShadow: `2px 2px 0px rgba(0,0,0,0.5)`,
                  }}
                >
                  {feature.title}
                </h3>
                <p className="text-mc-gray text-xs font-pixel leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
