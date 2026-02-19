import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CampusCraft - 대학생 전용 마인크래프트 서버 | 사전신청",
  description:
    "대학교 이메일 인증으로 소속 대학교 팀에 자동 배정! 29개 대학이 함께하는 대학생 전용 마인크래프트 서버 CampusCraft. 지금 사전신청하고 우선 입장권을 받으세요.",
  keywords: [
    "마인크래프트",
    "대학생",
    "마크",
    "서버",
    "CampusCraft",
    "캠퍼스크래프트",
    "대학교",
    "마인크래프트 서버",
    "대학 대항전",
    "ac.kr",
  ],
  openGraph: {
    title: "CampusCraft - 대학생 전용 마인크래프트 서버",
    description:
      "ac.kr 이메일 인증 한 번이면 끝! 소속 대학교 팀에 자동 배정. 29개 대학이 함께하는 마인크래프트 서버.",
    type: "website",
    locale: "ko_KR",
    url: "https://campuscraft.example.com",
    siteName: "CampusCraft",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusCraft - 대학생 전용 마인크래프트 서버",
    description:
      "ac.kr 이메일 인증 한 번이면 끝! 29개 대학이 함께하는 마인크래프트 서버.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://campuscraft.example.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CampusCraft",
  description: "대학생 전용 마인크래프트 서버 - ac.kr 이메일 인증으로 자동 팀 배정",
  url: "https://campuscraft.example.com",
  applicationCategory: "GameApplication",
  operatingSystem: "Windows, macOS, Linux",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pressStart2P.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-pixel antialiased">{children}</body>
    </html>
  );
}
