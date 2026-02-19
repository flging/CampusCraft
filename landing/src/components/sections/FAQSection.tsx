"use client";

import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { faqItems } from "@/data/faq";

function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border border-white/5 bg-black/20">
      <button
        className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="font-pixel text-sm text-mc-gold pr-4">{question}</span>
        <span
          className="text-mc-dark-gray font-pixel text-xs flex-shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)" }}
        >
          ▼
        </span>
      </button>
      <div
        className="overflow-hidden transition-all duration-200"
        style={{
          maxHeight: isOpen ? "200px" : "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p className="px-5 pb-4 text-mc-gray text-xs font-pixel leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-20 md:py-32 px-4" aria-labelledby="faq-heading">
      <div className="max-w-2xl mx-auto">
        <ScrollReveal>
          <h2
            id="faq-heading"
            className="font-pixel-bold text-mc-yellow text-xl md:text-2xl text-center mb-4"
            style={{ textShadow: "2px 2px 0px rgb(63, 63, 0)" }}
          >
            자주 묻는 질문
          </h2>
          <p className="text-mc-gray text-sm text-center mb-12 font-pixel">
            궁금한 것이 있다면 확인해보세요
          </p>
        </ScrollReveal>

        <div className="space-y-2">
          {faqItems.map((item, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <FAQItem
                question={item.question}
                answer={item.answer}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
