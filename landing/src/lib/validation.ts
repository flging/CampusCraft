// ac.kr 또는 .edu 도메인 이메일 검증
const UNIVERSITY_EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(ac\.kr|edu)$/i;

// 마인크래프트 닉네임: 영문, 숫자, 언더스코어만 허용, 3~16자
const MC_NICKNAME_REGEX = /^[a-zA-Z0-9_]{3,16}$/;

export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email.trim()) {
    return { valid: false, error: "이메일을 입력해주세요." };
  }
  if (!UNIVERSITY_EMAIL_REGEX.test(email)) {
    return { valid: false, error: "대학교 이메일(ac.kr)만 사용할 수 있습니다." };
  }
  return { valid: true };
}

export function validateNickname(nickname: string): { valid: boolean; error?: string } {
  if (!nickname.trim()) {
    return { valid: false, error: "마인크래프트 닉네임을 입력해주세요." };
  }
  if (!MC_NICKNAME_REGEX.test(nickname)) {
    return {
      valid: false,
      error: "닉네임은 영문, 숫자, 언더스코어만 가능하며 3~16자여야 합니다.",
    };
  }
  return { valid: true };
}
