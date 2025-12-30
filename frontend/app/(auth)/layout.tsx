import type { ReactNode } from 'react';

/**
 * 認証用レイアウト（ログイン前）
 * ログインページなど認証関連ページに適用
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
