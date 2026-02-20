"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import MinecraftButton from "@/components/ui/MinecraftButton";
import MinecraftInput from "@/components/ui/MinecraftInput";

type PageState =
  | "emailForm"
  | "loading"
  | "emailSent"
  | "editing"
  | "success"
  | "error";

function ChangeNicknameContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [state, setState] = useState<PageState>(token ? "loading" : "emailForm");
  const [email, setEmail] = useState("");
  const [currentNickname, setCurrentNickname] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldError, setFieldError] = useState("");

  // 토큰이 있으면 현재 닉네임 조회
  useEffect(() => {
    if (!token) return;

    fetch(`/api/change-nickname?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCurrentNickname(data.currentNickname);
          setState("editing");
        } else {
          setErrorMessage(data.error || "유효하지 않은 링크입니다.");
          setState("error");
        }
      })
      .catch(() => {
        setErrorMessage("네트워크 오류가 발생했습니다.");
        setState("error");
      });
  }, [token]);

  // 이메일로 변경 링크 요청
  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError("");

      if (!email.trim()) {
        setFieldError("이메일을 입력해주세요.");
        return;
      }

      setState("loading");

      try {
        const res = await fetch("/api/change-nickname", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });
        const data = await res.json();

        if (res.ok) {
          setState("emailSent");
        } else {
          setFieldError(data.error || "오류가 발생했습니다.");
          setState("emailForm");
        }
      } catch {
        setFieldError("네트워크 오류가 발생했습니다.");
        setState("emailForm");
      }
    },
    [email]
  );

  // 닉네임 변경 제출
  const handleNicknameSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setFieldError("");

      if (!newNickname.trim()) {
        setFieldError("새 닉네임을 입력해주세요.");
        return;
      }

      setState("loading");

      try {
        const res = await fetch("/api/change-nickname", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, nickname: newNickname.trim() }),
        });
        const data = await res.json();

        if (data.success) {
          setState("success");
        } else {
          setFieldError(data.error || "변경에 실패했습니다.");
          setState("editing");
        }
      } catch {
        setFieldError("네트워크 오류가 발생했습니다.");
        setState("editing");
      }
    },
    [token, newNickname]
  );

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center p-8 bg-black/20 border border-mc-gray/20 rounded">
        <h1
          className="font-pixel-bold text-mc-gold text-lg mb-6"
          style={{ textShadow: "2px 2px 0px rgb(63, 42, 0)" }}
        >
          닉네임 변경
        </h1>

        {/* 로딩 */}
        {state === "loading" && (
          <p className="text-mc-gray text-xs font-pixel">처리 중...</p>
        )}

        {/* 이메일 입력 폼 */}
        {state === "emailForm" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <p className="text-mc-gray text-xs font-pixel mb-4">
              사전신청 시 사용한 이메일을 입력해주세요.
              <br />
              닉네임 변경 링크를 보내드립니다.
            </p>
            <MinecraftInput
              type="email"
              placeholder="student@university.ac.kr"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldError("");
              }}
              error={fieldError}
            />
            <MinecraftButton
              type="submit"
              variant="green"
              size="md"
              className="w-full"
            >
              변경 링크 받기
            </MinecraftButton>
          </form>
        )}

        {/* 이메일 발송 완료 */}
        {state === "emailSent" && (
          <>
            <p className="text-mc-green text-sm font-pixel-bold mb-2">
              메일을 확인해주세요!
            </p>
            <p className="text-mc-gray text-xs font-pixel mb-2">
              인증된 이메일이라면 닉네임 변경 링크가 발송됩니다.
            </p>
            <p className="text-mc-gray text-xs font-pixel mb-6">
              메일이 보이지 않으면 스팸 폴더를 확인해주세요.
            </p>
            <a
              href="/"
              className="inline-block bg-mc-dark-green text-white font-pixel text-sm px-6 py-3 border-b-4 border-[#006600] hover:brightness-110 transition-all"
            >
              홈으로 돌아가기
            </a>
          </>
        )}

        {/* 닉네임 편집 */}
        {state === "editing" && (
          <form onSubmit={handleNicknameSubmit} className="space-y-4">
            <div className="mb-4">
              <p className="text-mc-gray text-xs font-pixel mb-1">
                현재 닉네임
              </p>
              <p className="text-mc-aqua text-sm font-pixel-bold">
                {currentNickname}
              </p>
            </div>
            <div>
              <label className="block text-mc-gray text-xs font-pixel mb-2 text-left">
                새 닉네임
              </label>
              <MinecraftInput
                type="text"
                placeholder="NewNickname"
                value={newNickname}
                onChange={(e) => {
                  setNewNickname(e.target.value);
                  setFieldError("");
                }}
                error={fieldError}
              />
            </div>
            <MinecraftButton
              type="submit"
              variant="green"
              size="md"
              className="w-full"
            >
              변경하기
            </MinecraftButton>
          </form>
        )}

        {/* 변경 완료 */}
        {state === "success" && (
          <>
            <p className="text-mc-green text-lg font-pixel-bold mb-2">
              닉네임이 변경되었습니다!
            </p>
            <p className="text-mc-aqua text-sm font-pixel mb-6">
              {newNickname}
            </p>
            <a
              href="/"
              className="inline-block bg-mc-dark-green text-white font-pixel text-sm px-6 py-3 border-b-4 border-[#006600] hover:brightness-110 transition-all"
            >
              홈으로 돌아가기
            </a>
          </>
        )}

        {/* 에러 */}
        {state === "error" && (
          <>
            <p className="text-mc-red text-sm font-pixel-bold mb-2">
              {errorMessage}
            </p>
            <a
              href="/change-nickname"
              className="inline-block bg-mc-dark-green text-white font-pixel text-sm px-6 py-3 border-b-4 border-[#006600] hover:brightness-110 transition-all"
            >
              다시 시도하기
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function ChangeNicknamePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center p-8 bg-black/20 border border-mc-gray/20 rounded">
            <p className="text-mc-gold text-lg font-pixel-bold mb-2">
              닉네임 변경
            </p>
            <p className="text-mc-gray text-xs font-pixel">
              로딩 중...
            </p>
          </div>
        </div>
      }
    >
      <ChangeNicknameContent />
    </Suspense>
  );
}
