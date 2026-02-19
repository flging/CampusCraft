"use client";

import { useCallback } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import MinecraftButton from "@/components/ui/MinecraftButton";
import MinecraftInput from "@/components/ui/MinecraftInput";
import MinecraftToast from "@/components/ui/MinecraftToast";
import { usePreRegister } from "@/hooks/usePreRegister";

export default function PreRegisterForm() {
  const { form, setEmail, setNickname, submit, reset } = usePreRegister();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      submit();
    },
    [submit]
  );

  const handleToastClose = useCallback(() => {
    // Toast 닫힘 후 처리 (폼은 유지)
  }, []);

  return (
    <section
      id="pre-register"
      className="py-20 md:py-32 px-4 bg-bg-darker/50"
      aria-labelledby="register-heading"
    >
      <div className="max-w-lg mx-auto">
        <ScrollReveal>
          <h2
            id="register-heading"
            className="font-pixel-bold text-mc-gold text-xl md:text-2xl text-center mb-4"
            style={{ textShadow: "2px 2px 0px rgb(63, 42, 0)" }}
          >
            사전 신청
          </h2>
          <p className="text-mc-gray text-sm text-center mb-10 font-pixel">
            3월 3일 오픈! 사전신청 시 우선 알림 + 학교별 과잠 갑옷 지급
          </p>
        </ScrollReveal>

        {form.isSuccess ? (
          <ScrollReveal>
            <div className="text-center p-8 bg-black/20 border border-mc-green/20">
              <p className="text-mc-green text-lg font-pixel-bold mb-2">
                사전 신청 완료!
              </p>
              {form.universityName && (
                <p className="text-mc-aqua text-sm font-pixel mb-4">
                  {form.universityName} 팀으로 배정될 예정입니다
                </p>
              )}
              <p className="text-mc-gray text-xs font-pixel mb-6">
                3월 3일 오픈일에 이메일로 접속 안내드리겠습니다.
              </p>
              <MinecraftButton size="sm" onClick={reset}>
                다른 계정으로 신청
              </MinecraftButton>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={0.1}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-mc-gray text-xs font-pixel mb-2">
                  대학교 이메일
                </label>
                <MinecraftInput
                  type="email"
                  placeholder="student@university.ac.kr"
                  value={form.email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={form.emailError}
                  disabled={form.isSubmitting}
                />
              </div>

              <div>
                <label className="block text-mc-gray text-xs font-pixel mb-2">
                  마인크래프트 닉네임
                </label>
                <MinecraftInput
                  type="text"
                  placeholder="Steve"
                  value={form.nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  error={form.nicknameError}
                  disabled={form.isSubmitting}
                />
              </div>

              {form.serverError && (
                <p className="text-mc-red text-xs font-pixel text-center">
                  {form.serverError}
                </p>
              )}

              <MinecraftButton
                type="submit"
                variant="green"
                size="lg"
                className="w-full"
                disabled={form.isSubmitting}
              >
                {form.isSubmitting ? "신청 중..." : "사전 신청하기"}
              </MinecraftButton>

              <p className="text-mc-dark-gray text-[10px] font-pixel text-center mt-4">
                * ac.kr 또는 .edu 도메인 이메일만 사용할 수 있습니다
              </p>
            </form>
          </ScrollReveal>
        )}
      </div>

      <MinecraftToast
        show={form.isSuccess}
        title="도전 과제 달성!"
        description="사전 신청 완료!"
        onClose={handleToastClose}
      />
    </section>
  );
}
