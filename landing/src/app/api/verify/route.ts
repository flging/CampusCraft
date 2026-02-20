import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "인증 토큰이 없습니다." },
      { status: 400 }
    );
  }

  if (!supabaseAdmin) {
    console.log("[DEV] Verify token:", token);
    return NextResponse.json({ success: true, alreadyVerified: false });
  }

  // 토큰으로 사전신청 조회
  const { data, error } = await supabaseAdmin
    .from("pre_registrations")
    .select("id, email_verified, token_expires_at")
    .eq("verification_token", token)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "유효하지 않은 인증 링크입니다." },
      { status: 400 }
    );
  }

  // 이미 인증된 경우
  if (data.email_verified) {
    return NextResponse.json({ success: true, alreadyVerified: true });
  }

  // 만료 확인
  if (
    data.token_expires_at &&
    new Date(data.token_expires_at) < new Date()
  ) {
    return NextResponse.json(
      { error: "인증 링크가 만료되었습니다. 다시 신청해주세요." },
      { status: 410 }
    );
  }

  // 인증 처리: verified=true, 토큰 null 처리 (재사용 방지)
  const { error: updateError } = await supabaseAdmin
    .from("pre_registrations")
    .update({
      email_verified: true,
      verification_token: null,
      token_expires_at: null,
    })
    .eq("id", data.id);

  if (updateError) {
    console.error("Verify update error:", updateError);
    return NextResponse.json(
      { error: "인증 처리 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, alreadyVerified: false });
}
