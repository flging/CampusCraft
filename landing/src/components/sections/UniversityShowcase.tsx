"use client";

import ScrollReveal from "@/components/ui/ScrollReveal";
import UniversityTag from "@/components/ui/UniversityTag";
import { universities } from "@/data/universities";

export default function UniversityShowcase() {
  return (
    <section className="py-20 md:py-32 px-4" aria-labelledby="university-heading">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal>
          <h2
            id="university-heading"
            className="font-pixel-bold text-mc-aqua text-xl md:text-2xl text-center mb-4"
            style={{ textShadow: "2px 2px 0px rgb(0, 42, 42)" }}
          >
            참여 가능 대학교
          </h2>
          <p className="text-mc-gray text-sm text-center mb-12 md:mb-16 font-pixel">
            현재 {universities.length}개 대학을 지원합니다
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex flex-wrap justify-center gap-3">
            {universities.map((uni) => (
              <div
                key={uni.id}
                className="hover:scale-105 hover:-translate-y-0.5 transition-transform duration-200"
              >
                <UniversityTag
                  tag={uni.tag}
                  colorHex={uni.colorHex}
                  name={uni.name}
                />
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <p className="text-mc-dark-gray text-xs text-center mt-8 font-pixel">
            + 더 많은 대학이 추가될 예정입니다
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
