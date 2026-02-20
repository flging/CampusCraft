import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "닉네임 변경 - CampusCraft",
  robots: { index: false, follow: false },
};

export default function ChangeNicknameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
