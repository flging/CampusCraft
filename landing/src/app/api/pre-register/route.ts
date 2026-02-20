import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
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

    // 토큰 생성 (24시간 만료)
    const verificationToken = crypto.randomUUID();
    const tokenExpiresAt = new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ).toISOString();

    // Supabase 연결 시: DB에 저장
    if (supabase) {
      const { error } = await supabase.from("pre_registrations").insert({
        email: email.toLowerCase(),
        email_domain: emailDomain,
        university_tag: university?.tag || null,
        university_name: university?.name || null,
        minecraft_nickname: nickname,
        email_verified: false,
        verification_token: verificationToken,
        token_expires_at: tokenExpiresAt,
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

      // 인증 이메일 발송
      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        `https://${request.headers.get("host")}`;
      const verifyUrl = `${baseUrl}/verify?token=${verificationToken}`;

      if (resend) {
        try {
          await resend.emails.send({
            from: "CampusCraft <noreply@campuscraft.xyz>",
            to: email.toLowerCase(),
            subject: "⛏️ CampusCraft 이메일 인증",
            html: buildVerificationEmail(nickname, verifyUrl, university?.name),
          });
        } catch (emailError) {
          console.error("Resend error:", emailError);
          // 이메일 발송 실패해도 사전신청은 유지
        }
      } else {
        console.log("[DEV] Verification URL:", verifyUrl);
      }
    } else {
      // 개발 모드: Supabase 미연결
      const verifyUrl = `http://localhost:3000/verify?token=${verificationToken}`;
      console.log("[DEV] Pre-registration:", {
        email,
        emailDomain,
        university: university?.name || "미확인",
        nickname,
        verifyUrl,
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

function buildVerificationEmail(
  nickname: string,
  verifyUrl: string,
  universityName?: string
): string {
  const teamLine = universityName
    ? `<p style="color:#55FFFF;font-size:14px;margin:0 0 24px 0;">${universityName} 팀으로 배정될 예정입니다</p>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#1a1a2e;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:40px 20px;">
    <div style="background-color:#12121f;border:2px solid #333;border-radius:4px;padding:32px;text-align:center;">
      <h1 style="color:#FFAA00;font-size:24px;margin:0 0 8px 0;">⛏️ CampusCraft</h1>
      <p style="color:#AAAAAA;font-size:12px;margin:0 0 32px 0;">대학생 전용 마인크래프트 서버</p>

      <p style="color:#FFFFFF;font-size:16px;margin:0 0 8px 0;">
        안녕하세요, <span style="color:#55FF55;">${nickname}</span>님!
      </p>
      <p style="color:#AAAAAA;font-size:14px;margin:0 0 8px 0;">
        사전 신청을 완료하려면 아래 버튼을 클릭해주세요.
      </p>
      ${teamLine}

      <a href="${verifyUrl}"
         style="display:inline-block;background-color:#00AA00;color:#FFFFFF;text-decoration:none;padding:14px 32px;font-size:16px;font-weight:bold;border-radius:4px;border-bottom:4px solid #006600;">
        이메일 인증하기
      </a>

      <p style="color:#555555;font-size:11px;margin:24px 0 0 0;">
        이 링크는 24시간 동안 유효합니다.
      </p>
      <p style="color:#555555;font-size:11px;margin:8px 0 0 0;">
        본인이 신청하지 않으셨다면 이 이메일을 무시해주세요.
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}
