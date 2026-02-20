import type { Metadata, Viewport } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";
import { faqItems } from "@/data/faq";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-title",
  display: "swap",
});

const SITE_URL = "https://campuscraft.xyz";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a2e",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    url: SITE_URL,
    siteName: "CampusCraft",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CampusCraft - 대학생 전용 마인크래프트 서버",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusCraft - 대학생 전용 마인크래프트 서버",
    description:
      "ac.kr 이메일 인증 한 번이면 끝! 29개 대학이 함께하는 마인크래프트 서버.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    other: {
      "naver-site-verification": "963bb9447f46b41f026f5a8606b3cefcb76d5a94",
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CampusCraft",
  description:
    "대학생 전용 마인크래프트 서버 - ac.kr 이메일 인증으로 자동 팀 배정",
  url: SITE_URL,
  applicationCategory: "GameApplication",
  operatingSystem: "Windows, macOS, Linux",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer.replace(/<[^>]*>/g, ""),
    },
  })),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={pressStart2P.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="font-pixel antialiased">{children}</body>
    </html>
  );
}
