import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

// Resend가 설정되지 않은 경우 null 반환 (개발 모드)
export const resend = resendApiKey ? new Resend(resendApiKey) : null;
