"use client";

import { useState, useCallback } from "react";
import { validateEmail, validateNickname } from "@/lib/validation";

interface FormState {
  email: string;
  nickname: string;
  emailError?: string;
  nicknameError?: string;
  isSubmitting: boolean;
  isSuccess: boolean;
  serverError?: string;
  universityName?: string;
}

export function usePreRegister() {
  const [form, setForm] = useState<FormState>({
    email: "",
    nickname: "",
    isSubmitting: false,
    isSuccess: false,
  });

  const setEmail = (email: string) =>
    setForm((prev) => ({ ...prev, email, emailError: undefined, serverError: undefined }));

  const setNickname = (nickname: string) =>
    setForm((prev) => ({ ...prev, nickname, nicknameError: undefined, serverError: undefined }));

  const submit = useCallback(async () => {
    const emailResult = validateEmail(form.email);
    const nicknameResult = validateNickname(form.nickname);

    if (!emailResult.valid || !nicknameResult.valid) {
      setForm((prev) => ({
        ...prev,
        emailError: emailResult.error,
        nicknameError: nicknameResult.error,
      }));
      return;
    }

    setForm((prev) => ({ ...prev, isSubmitting: true, serverError: undefined }));

    try {
      const res = await fetch("/api/pre-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, nickname: form.nickname }),
      });

      const data = await res.json();

      if (!res.ok) {
        setForm((prev) => ({
          ...prev,
          isSubmitting: false,
          serverError: data.error || "오류가 발생했습니다.",
        }));
        return;
      }

      setForm((prev) => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true,
        universityName: data.universityName,
      }));
    } catch {
      setForm((prev) => ({
        ...prev,
        isSubmitting: false,
        serverError: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      }));
    }
  }, [form.email, form.nickname]);

  const reset = () =>
    setForm({ email: "", nickname: "", isSubmitting: false, isSuccess: false });

  return { form, setEmail, setNickname, submit, reset };
}
