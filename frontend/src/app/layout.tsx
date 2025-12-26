import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "シンプル会計帳簿",
  description: "個人事業主向けの会計アプリケーション",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
