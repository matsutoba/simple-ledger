import type { Metadata } from 'next';
import { Noto_Sans_JP, Noto_Sans_Mono } from 'next/font/google';
import { QueryProvider } from './providers/QueryProvider';
import './globals.css';

const notoSansJp = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  weight: ['400', '700'],
  preload: true,
});

const notoSansMono = Noto_Sans_Mono({
  variable: '--font-noto-sans-mono',
  weight: ['400', '700'],
  preload: true,
});

export const metadata: Metadata = {
  title: 'Small Ledger',
  description: 'ポートフォリオアプリケーション',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${notoSansJp.variable} ${notoSansMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
