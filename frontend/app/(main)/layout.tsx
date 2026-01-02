'use client';

import { Header } from '@/components/features/layout/Header';
import { SideMenu } from '@/components/features/layout/SideMenu';
import { InlineStack } from '@/components/ui/Stack';
import type { ReactNode } from 'react';

/**
 * メインアプリケーションレイアウト（ログイン後）
 * ダッシュボード・機能ページに適用
 * 今後、ナビゲーションバーやサイドバーを追加
 */
export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-gray-50">
      <Header />
      <InlineStack
        className="grid grid-cols-[180px_1fr] overflow-hidden"
        alignItems="stretch"
      >
        <aside className="flex flex-col overflow-y-auto py-2 px-4 border-r border-gray-200 bg-white">
          <SideMenu />
        </aside>
        {children}
      </InlineStack>
    </div>
  );
}
