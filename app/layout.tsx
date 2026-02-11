import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "포트폴리오 리밸런서",
  description: "정밀한 자산 배분 최적화 도구. 개인정보 보호를 위한 클라이언트 기반 리밸런싱 계산기.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground selection:bg-primary/30 transition-colors duration-300`}
      >
        <ThemeProvider>
          <div className="absolute inset-0 z-[-1] h-full w-full bg-[radial-gradient(var(--color-muted-foreground)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
