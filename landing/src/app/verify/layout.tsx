import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "이메일 인증 - CampusCraft",
  description: "CampusCraft 사전신청 이메일 인증 페이지입니다.",
  robots: { index: false, follow: false },
};

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
