import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateEmail, validateNickname } from "@/lib/validation";
import { findUniversityByEmail } from "@/data/universities";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, nickname } = body;

    // 서버사이드 검증
    const emailResult = validateEmail(email);
    if (!emailResult.valid) {
      return NextResponse.json({ error: emailResult.error }, { status: 400 });
    }

    const nicknameResult = validateNickname(nickname);
    if (!nicknameResult.valid) {
      return NextResponse.json({ error: nicknameResult.error }, { status: 400 });
    }

    // 대학교 매칭
    const university = findUniversityByEmail(email);
    const emailDomain = email.split("@")[1].toLowerCase();

    // Supabase 연결 시: DB에 저장
    if (supabase) {
      const { error } = await supabase.from("pre_registrations").insert({
        email: email.toLowerCase(),
        email_domain: emailDomain,
        university_tag: university?.tag || null,
        university_name: university?.name || null,
        minecraft_nickname: nickname,
      });

      if (error) {
        // 중복 이메일 처리
        if (error.code === "23505") {
          return NextResponse.json(
            { error: "이미 신청된 이메일입니다." },
            { status: 409 }
          );
        }
        console.error("Supabase error:", error);
        return NextResponse.json(
          { error: "서버 오류가 발생했습니다." },
          { status: 500 }
        );
      }
    } else {
      // 개발 모드: Supabase 미연결
      console.log("[DEV] Pre-registration:", {
        email,
        emailDomain,
        university: university?.name || "미확인",
        nickname,
      });
    }

    return NextResponse.json({
      success: true,
      universityName: university?.name || null,
      universityTag: university?.tag || null,
    });
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 }
    );
  }
}
