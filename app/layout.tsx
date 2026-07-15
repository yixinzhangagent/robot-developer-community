import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ROBOHUB 机研社｜机器人开发者社区",
  description: "面向机器人开发者的精选资讯、工程实践、开源项目与技术社区。",
  keywords: ["机器人", "具身智能", "ROS", "仿真", "控制", "开源项目"],
  openGraph: {
    title: "ROBOHUB 机研社｜机器人开发者社区",
    description: "把值得动手验证的机器人技术，带到真正造机器人的人面前。",
    type: "website",
    locale: "zh_CN",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "ROBOHUB 机研社" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ROBOHUB 机研社",
    description: "机器人开发者的精选资讯、工程实践与开源社区。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
