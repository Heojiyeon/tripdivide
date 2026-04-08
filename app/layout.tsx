import { Provider } from "@/components/ui/provider";
import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";
import { HiCalculator } from "react-icons/hi";

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
    <html lang="ko" data-theme="light" suppressHydrationWarning>
      <body className={`${pretendard.className} antialiased`}>
        <Provider>
          <header>
            <div className="border-b border-gray-300 mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <HiCalculator className="text-xl text-blue-400" />
                <span className="text-xl font-bold">TripDivide</span>
              </div>
            </div>
          </header>
          <main className="max-w-5xl min-h-screen mx-auto">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
