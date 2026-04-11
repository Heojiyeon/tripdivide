import { Provider } from "@/components/ui/provider";
import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";
import { HiCalculator } from "react-icons/hi";
import { Toaster } from "@/components/ui/toaster";
import Link from "next/link";

const pretendard = localFont({
  src: "./../public/fonts/PretendardVariable.woff2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TripDivide",
  description: "Trip expense settlement service",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "TripDivide",
    description: "여행 지출을 나누고 정산 결과를 확인하는 서비스",
    url: "https://tripdivide.vercel.app",
    siteName: "TripDivide",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "TripDivide",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className} antialiased`}>
        <Provider>
          <header className="sticky top-0 z-50 bg-white">
            <div className="border-b border-gray-300 mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-2">
                <HiCalculator className="text-xl text-blue-400" />
                <span className="text-xl font-bold">TripDivide</span>
              </Link>
            </div>
          </header>
          <main className="max-w-5xl min-h-screen mx-auto bg-white">{children}</main>
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
