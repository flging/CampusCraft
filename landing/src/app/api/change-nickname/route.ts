import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { validateNickname } from "@/lib/validation";

// POST: 이메일로 닉네임 변경 링크 발송
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "이메일을 입력해주세요." },
        { status: 400 }
      );
    }

    const successResponse = NextResponse.json({
      success: true,
      message:
        "인증된 이메일이라면 닉네임 변경 링크가 발송됩니다. 메일함을 확인해주세요.",
    });

    if (!supabaseAdmin) {
      console.log("[DEV] Change nickname request for:", email);
      return successResponse;
    }

    // 인증된 유저만 조회 (정보 노출 방지: 미등록/미인증이어도 동일 응답)
    const { data, error } = await supabaseAdmin
      .from("pre_registrations")
      .select("id, minecraft_nickname")
      .eq("email", email.toLowerCase())
      .eq("email_verified", true)
      .single();

    if (error || !data) {
      return successResponse;
    }

    // 토큰 생성 (1시간 만료)
    const token = crypto.randomUUID();
    const tokenExpiresAt = new Date(
      Date.now() + 60 * 60 * 1000
    ).toISOString();

    const { error: updateError } = await supabaseAdmin
      .from("pre_registrations")
      .update({
        verification_token: token,
        token_expires_at: tokenExpiresAt,
      })
      .eq("id", data.id);

    if (updateError) {
      console.error("Token update error:", updateError);
      return NextResponse.json(
        { error: "서버 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 변경 링크 이메일 발송
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      `https://${request.headers.get("host")}`;
    const changeUrl = `${baseUrl}/change-nickname?token=${token}`;

    if (resend) {
      try {
        await resend.emails.send({
          from: "CampusCraft <noreply@campuscraft.xyz>",
          to: email.toLowerCase(),
          subject: "⛏️ CampusCraft 닉네임 변경",
          html: buildChangeNicknameEmail(data.minecraft_nickname, changeUrl),
        });
      } catch (emailError) {
        console.error("Resend error:", emailError);
      }
    } else {
      console.log("[DEV] Change nickname URL:", changeUrl);
    }

    return successResponse;
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 }
    );
  }
}

// PATCH: 토큰으로 닉네임 변경
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, nickname } = body;

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "유효하지 않은 요청입니다." },
        { status: 400 }
      );
    }

    const nicknameResult = validateNickname(nickname);
    if (!nicknameResult.valid) {
      return NextResponse.json(
        { error: nicknameResult.error },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      console.log("[DEV] Change nickname:", { token, nickname });
      return NextResponse.json({ success: true });
    }

    // 토큰으로 인증된 유저 조회
    const { data, error } = await supabaseAdmin
      .from("pre_registrations")
      .select("id, email_verified, token_expires_at")
      .eq("verification_token", token)
      .eq("email_verified", true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "유효하지 않은 링크입니다." },
        { status: 400 }
      );
    }

    // 만료 확인
    if (
      data.token_expires_at &&
      new Date(data.token_expires_at) < new Date()
    ) {
      return NextResponse.json(
        { error: "링크가 만료되었습니다. 다시 요청해주세요." },
        { status: 410 }
      );
    }

    // 닉네임 변경 + 토큰 무효화
    const { error: updateError } = await supabaseAdmin
      .from("pre_registrations")
      .update({
        minecraft_nickname: nickname,
        verification_token: null,
        token_expires_at: null,
      })
      .eq("id", data.id);

    if (updateError) {
      console.error("Nickname update error:", updateError);
      return NextResponse.json(
        { error: "닉네임 변경 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다." },
      { status: 400 }
    );
  }
}

// GET: 토큰으로 현재 닉네임 조회
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "토큰이 없습니다." },
      { status: 400 }
    );
  }

  if (!supabaseAdmin) {
    console.log("[DEV] Get nickname for token:", token);
    return NextResponse.json({
      success: true,
      currentNickname: "TestPlayer",
    });
  }

  const { data, error } = await supabaseAdmin
    .from("pre_registrations")
    .select("minecraft_nickname, email_verified, token_expires_at")
    .eq("verification_token", token)
    .eq("email_verified", true)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "유효하지 않은 링크입니다." },
      { status: 400 }
    );
  }

  if (
    data.token_expires_at &&
    new Date(data.token_expires_at) < new Date()
  ) {
    return NextResponse.json(
      { error: "링크가 만료되었습니다. 다시 요청해주세요." },
      { status: 410 }
    );
  }

  return NextResponse.json({
    success: true,
    currentNickname: data.minecraft_nickname,
  });
}

function buildChangeNicknameEmail(
  currentNickname: string,
  changeUrl: string
): string {
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
                  <span style="color:#3f3f3f;font-size:11px;letter-spacing:2px;">닉네임 변경 요청</span>
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

              <!-- 현재 닉네임 (인벤토리 슬롯 스타일) -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
                <tr><td align="center">
                  <table role="presentation" cellpadding="0" cellspacing="0" style="background-color:#282828;border:2px solid #000;border-top-color:#3c3c3c;border-left-color:#3c3c3c;">
                    <tr>
                      <td style="padding:10px 14px;vertical-align:middle;background-color:#1a1a1a;border:1px solid #3c3c3c;">
                        <span style="font-size:24px;">🏷️</span>
                      </td>
                      <td style="padding:10px 18px 10px 14px;vertical-align:middle;">
                        <div style="color:#AAAAAA;font-size:11px;letter-spacing:1px;">현재 닉네임</div>
                        <div style="color:#55FF55;font-size:17px;margin-top:2px;font-weight:bold;">${currentNickname}</div>
                      </td>
                    </tr>
                  </table>
                </td></tr>
              </table>

              <!-- 본문 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td style="padding:0 0 20px 0;text-align:center;">
                  <span style="color:#AAAAAA;font-size:13px;">닉네임을 변경하려면 아래 버튼을 클릭해주세요.</span>
                </td></tr>
              </table>

              <!-- MC 버튼 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr><td align="center">
                  <a href="${changeUrl}" target="_blank"
                     style="display:inline-block;text-decoration:none;background-color:#4a7d2e;color:#FFFFFF;font-size:16px;font-weight:bold;padding:12px 40px;letter-spacing:2px;border:3px solid #1a3a0a;border-top-color:#6aad3e;border-left-color:#6aad3e;text-shadow:2px 2px 0px rgba(0,0,0,0.4);">
                    닉네임 변경하기
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

              <!-- 하단 안내 -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 0 0;">
                <tr><td style="text-align:center;padding:0 0 4px 0;">
                  <span style="color:#555;font-size:11px;">⏰ 이 링크는 1시간 동안 유효합니다.</span>
                </td></tr>
                <tr><td style="text-align:center;">
                  <span style="color:#555;font-size:11px;">본인이 요청하지 않으셨다면 이 이메일을 무시해주세요.</span>
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
