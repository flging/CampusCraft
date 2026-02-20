"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

type VerifyStatus = "loading" | "success" | "already" | "error";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<VerifyStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("인증 토큰이 없습니다.");
      return;
    }

    fetch(`/api/verify?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus(data.alreadyVerified ? "already" : "success");
        } else {
          setStatus("error");
          setErrorMessage(data.error || "인증에 실패했습니다.");
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("네트워크 오류가 발생했습니다.");
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center p-8 bg-black/20 border border-mc-gray/20 rounded">
        {status === "loading" && (
          <>
            <p className="text-mc-gold text-lg font-pixel-bold mb-2">
              ⛏️ 인증 중...
            </p>
            <p className="text-mc-gray text-xs font-pixel">
              잠시만 기다려주세요
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <p className="text-mc-green text-lg font-pixel-bold mb-2">
              이메일 인증 완료!
            </p>
            <p className="text-mc-gray text-sm font-pixel mb-6">
              사전 신청이 확정되었습니다.
              <br />
              3월 3일 오픈일에 접속 안내를 보내드리겠습니다.
            </p>
            <a
              href="/"
              className="inline-block bg-mc-dark-green text-white font-pixel text-sm px-6 py-3 border-b-4 border-[#006600] hover:brightness-110 transition-all"
            >
              홈으로 돌아가기
            </a>
          </>
        )}

        {status === "already" && (
          <>
            <p className="text-mc-aqua text-lg font-pixel-bold mb-2">
              이미 인증된 이메일입니다
            </p>
            <p className="text-mc-gray text-sm font-pixel mb-6">
              이메일 인증이 이미 완료되었습니다.
              <br />
              3월 3일 오픈일에 접속 안내를 보내드리겠습니다.
            </p>
            <a
              href="/"
              className="inline-block bg-mc-dark-green text-white font-pixel text-sm px-6 py-3 border-b-4 border-[#006600] hover:brightness-110 transition-all"
            >
              홈으로 돌아가기
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <p className="text-mc-red text-lg font-pixel-bold mb-2">
              인증 실패
            </p>
            <p className="text-mc-gray text-sm font-pixel mb-6">
              {errorMessage}
            </p>
            <a
              href="/#pre-register"
              className="inline-block bg-mc-dark-green text-white font-pixel text-sm px-6 py-3 border-b-4 border-[#006600] hover:brightness-110 transition-all"
            >
              다시 신청하기
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-dark flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center p-8 bg-black/20 border border-mc-gray/20 rounded">
            <p className="text-mc-gold text-lg font-pixel-bold mb-2">
              ⛏️ 인증 중...
            </p>
            <p className="text-mc-gray text-xs font-pixel">
              잠시만 기다려주세요
            </p>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
