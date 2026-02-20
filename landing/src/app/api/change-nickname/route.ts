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
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#1a1a2e;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:40px 20px;">
    <div style="background-color:#12121f;border:2px solid #333;border-radius:4px;padding:32px;text-align:center;">
      <h1 style="color:#FFAA00;font-size:24px;margin:0 0 8px 0;">⛏️ CampusCraft</h1>
      <p style="color:#AAAAAA;font-size:12px;margin:0 0 32px 0;">닉네임 변경 요청</p>

      <p style="color:#FFFFFF;font-size:16px;margin:0 0 8px 0;">
        현재 닉네임: <span style="color:#55FF55;">${currentNickname}</span>
      </p>
      <p style="color:#AAAAAA;font-size:14px;margin:0 0 24px 0;">
        닉네임을 변경하려면 아래 버튼을 클릭해주세요.
      </p>

      <a href="${changeUrl}"
         style="display:inline-block;background-color:#00AA00;color:#FFFFFF;text-decoration:none;padding:14px 32px;font-size:16px;font-weight:bold;border-radius:4px;border-bottom:4px solid #006600;">
        닉네임 변경하기
      </a>

      <p style="color:#555555;font-size:11px;margin:24px 0 0 0;">
        이 링크는 1시간 동안 유효합니다.
      </p>
      <p style="color:#555555;font-size:11px;margin:8px 0 0 0;">
        본인이 요청하지 않으셨다면 이 이메일을 무시해주세요.
      </p>
    </div>
  </div>
</body>
</html>`.trim();
}
