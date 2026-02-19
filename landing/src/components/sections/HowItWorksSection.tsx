"use client";

import { useState, useEffect } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

const steps = [
  {
    step: 1,
    title: "이메일 입력",
    description: "대학교 이메일을 입력하세요",
    demo: "student@snu.ac.kr",
    color: "#55FFFF",
  },
  {
    step: 2,
    title: "학교 인증",
    description: "이메일 도메인으로 자동 인식",
    demo: "snu.ac.kr → 서울대학교",
    color: "#FFAA00",
  },
  {
    step: 3,
    title: "팀 배정 완료",
    description: "소속 대학교 팀에 자동 배정!",
    demo: "[SNU] 서울대학교 팀 합류!",
    color: "#55FF55",
  },
];

function TypingDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeIndex = stepIndex % steps.length;
  const currentDemo = steps[safeIndex].demo;
  const currentColor = steps[safeIndex].color;
  const displayText = currentDemo.slice(0, charIndex);

  useEffect(() => {
    if (isPaused) {
      const pauseMs = safeIndex < steps.length - 1 ? 1500 : 2500;
      const timer = setTimeout(() => {
        setStepIndex((s) => (s + 1) % steps.length);
        setCharIndex(0);
        setIsPaused(false);
      }, pauseMs);
      return () => clearTimeout(timer);
    }

    if (charIndex < currentDemo.length) {
      const timer = setTimeout(() => {
        setCharIndex((c) => c + 1);
      }, 60);
      return () => clearTimeout(timer);
    }

    // Typing finished — pause
    const timer = setTimeout(() => setIsPaused(true), 0);
    return () => clearTimeout(timer);
  }, [charIndex, isPaused, safeIndex, currentDemo]);

  return (
    <div className="bg-black/60 border border-[#333] p-4 md:p-6 font-pixel text-sm max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-3 text-mc-dark-gray text-xs">
        <span>{'>'}</span>
        <span>CampusCraft 인증 시스템</span>
      </div>
      <div>
        <span className="text-mc-dark-gray">{'> '}</span>
        <span style={{ color: currentColor }}>
          {displayText}
          <span className="animate-pulse">_</span>
        </span>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  return (
    <section className="py-20 md:py-32 px-4 bg-bg-darker/50" aria-labelledby="how-heading">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <h2
            id="how-heading"
            className="font-pixel-bold text-mc-green text-xl md:text-2xl text-center mb-4"
            style={{ textShadow: "2px 2px 0px rgb(0, 42, 0)" }}
          >
            어떻게 참여하나요?
          </h2>
          <p className="text-mc-gray text-sm text-center mb-12 md:mb-16 font-pixel">
            3단계면 끝. 간단하죠?
          </p>
        </ScrollReveal>

        {/* 스텝 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((step, i) => (
            <ScrollReveal key={step.step} delay={i * 0.15}>
              <div className="text-center p-6">
                <div
                  className="w-12 h-12 mx-auto mb-4 flex items-center justify-center text-xl font-title border-2"
                  style={{
                    borderColor: step.color,
                    color: step.color,
                    textShadow: `0 0 10px ${step.color}40`,
                  }}
                >
                  {step.step}
                </div>
                <h3
                  className="font-pixel-bold text-sm mb-2"
                  style={{ color: step.color }}
                >
                  {step.title}
                </h3>
                <p className="text-mc-gray text-xs font-pixel">
                  {step.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* 타이핑 데모 */}
        <ScrollReveal delay={0.3}>
          <TypingDemo />
        </ScrollReveal>
      </div>
    </section>
  );
}
