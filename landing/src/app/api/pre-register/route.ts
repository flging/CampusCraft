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
    ? `<tr><td style="padding:0 0 20px 0;text-align:center;">
         <span style="color:#55FFFF;font-size:14px;letter-spacing:1px;">${universityName} 팀으로 배정될 예정입니다</span>
       </td></tr>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#2b2b2b;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#2b2b2b;">
    <tr><td align="center" style="padding:40px 16px;">
      <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;">

        <!-- MC 인벤토리 스타일 카드 -->
        <tr><td style="background-color:#c6c6c6;border:3px solid #000;border-top-color:#fff;border-left-color:#fff;padding:4px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#8b8b8b;border:2px solid #000;border-top-color:#555;border-left-color:#555;">
            <tr><td style="padding:28px 24px;">

              <!-- 로고 영역 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="text-align:center;padding:0 0 6px 0;">
                  <span style="color:#FFAA00;font-size:26px;font-weight:bold;letter-spacing:2px;text-shadow:2px 2px 0px #3f2a00;">⛏️ CampusCraft</span>
                </td></tr>
                <tr><td style="text-align:center;padding:0 0 24px 0;">
                  <span style="color:#3f3f3f;font-size:11px;letter-spacing:2px;">대학생 전용 마인크래프트 서버</span>
                </td></tr>
              </table>

              <!-- 구분선 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
                <tr>
                  <td style="border-bottom:2px solid #555;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="border-bottom:2px solid #aaa;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- 도전 과제 스타일 헤더 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
                <tr><td align="center">
                  <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#282828;border:2px solid #000;border-top-color:#3c3c3c;border-left-color:#3c3c3c;">
                    <tr>
                      <td style="padding:10px 14px;vertical-align:middle;background-color:#1a1a1a;border:1px solid #3c3c3c;">
                        <span style="font-size:24px;">💎</span>
                      </td>
                      <td style="padding:10px 18px 10px 14px;vertical-align:middle;">
                        <div style="color:#FFFF55;font-size:11px;letter-spacing:1px;">도전 과제 달성!</div>
                        <div style="color:#FFFFFF;font-size:15px;margin-top:2px;font-weight:bold;">이메일 인증을 완료해주세요</div>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>

              <!-- 본문 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:0 0 6px 0;text-align:center;">
                  <span style="color:#FFFFFF;font-size:16px;">안녕하세요, </span>
                  <span style="color:#55FF55;font-size:16px;font-weight:bold;">${nickname}</span>
                  <span style="color:#FFFFFF;font-size:16px;">님!</span>
                </td></tr>
                <tr><td style="padding:0 0 8px 0;text-align:center;">
                  <span style="color:#AAAAAA;font-size:13px;">사전 신청을 완료하려면 아래 버튼을 클릭해주세요.</span>
                </td></tr>
                ${teamLine}
              </table>

              <!-- MC 버튼 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 0 0;">
                <tr><td align="center">
                  <a href="${verifyUrl}" target="_blank"
                     style="display:inline-block;text-decoration:none;background-color:#4a7d2e;color:#FFFFFF;font-size:16px;font-weight:bold;padding:12px 40px;letter-spacing:2px;border:3px solid #1a3a0a;border-top-color:#6aad3e;border-left-color:#6aad3e;text-shadow:2px 2px 0px rgba(0,0,0,0.4);">
                    이메일 인증하기
                  </a>
                </td></tr>
              </table>

              <!-- 구분선 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0 0 0;">
                <tr>
                  <td style="border-bottom:2px solid #555;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="border-bottom:2px solid #aaa;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- 디스코드 안내 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0 0 0;">
                <tr><td align="center">
                  <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#282828;border:2px solid #000;border-top-color:#3c3c3c;border-left-color:#3c3c3c;width:100%;">
                    <tr>
                      <td style="padding:10px 14px;vertical-align:middle;background-color:#1a1a1a;border:1px solid #3c3c3c;width:48px;text-align:center;">
                        <span style="font-size:24px;">🎮</span>
                      </td>
                      <td style="padding:10px 18px 10px 14px;vertical-align:middle;">
                        <div style="color:#5865F2;font-size:11px;letter-spacing:1px;">STEP 2</div>
                        <div style="color:#FFFFFF;font-size:14px;margin-top:2px;font-weight:bold;">디스코드 서버에 참가하세요!</div>
                      </td>
                    </tr>
                  </table>
                </td></tr>
                <tr><td style="padding:12px 0 0 0;text-align:center;">
                  <span style="color:#AAAAAA;font-size:12px;">이메일 인증 후 디스코드에서 다른 플레이어들과 소통하세요.</span>
                </td></tr>
                <tr><td align="center" style="padding:14px 0 0 0;">
                  <a href="https://discord.gg/kPx9ChGvnQ" target="_blank"
                     style="display:inline-block;text-decoration:none;background-color:#5865F2;color:#FFFFFF;font-size:14px;font-weight:bold;padding:10px 32px;letter-spacing:1px;border:3px solid #3a42b0;border-top-color:#7983f5;border-left-color:#7983f5;text-shadow:1px 1px 0px rgba(0,0,0,0.3);">
                    디스코드 참가하기
                  </a>
                </td></tr>
              </table>

              <!-- 구분선 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 0 0;">
                <tr>
                  <td style="border-bottom:2px solid #555;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
                <tr>
                  <td style="border-bottom:2px solid #aaa;font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- 하단 안내 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 0 0;">
                <tr><td style="text-align:center;padding:0 0 4px 0;">
                  <span style="color:#555;font-size:11px;">⏰ 이 링크는 24시간 동안 유효합니다.</span>
                </td></tr>
                <tr><td style="text-align:center;">
                  <span style="color:#555;font-size:11px;">본인이 신청하지 않으셨다면 이 이메일을 무시해주세요.</span>
                </td></tr>
              </table>

            </td></tr>
          </table>
        </td></tr>

        <!-- 푸터 -->
        <tr><td style="text-align:center;padding:20px 0 0 0;">
          <span style="color:#555;font-size:10px;letter-spacing:1px;">campuscraft.xyz</span>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`.trim();
}
