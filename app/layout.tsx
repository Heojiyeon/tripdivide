import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";

const pretendard = localFont({
  src: "./../public/fonts/PretendardVariable.woff2",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TripDivide",
  description: "Trip expense settlement service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.className} antialiased`}>
        <header></header>
        <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
        <footer></footer>
      </body>
    </html>
  );
}
