import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "AI 工具工坊 - 你的需求，我们的作品",
  description: "提交你的软件需求，投票选出最想要的，我们来开发！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Header />

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-8 mt-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p>© 2026 AI 工具工坊 · 用 AI 创造价值</p>
            <p className="text-sm mt-2">Powered by OpenClaw 🦞</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
