'use client';

import { cn } from '@/components/shadcn/ui/utils';
import { Header } from '@/components/features/layout/Header';
import { SideMenu } from '@/components/features/layout/SideMenu';
import { InlineStack } from '@/components/ui/Stack';
import { ReactNode, useState } from 'react';

/**
 * メインアプリケーションレイアウト（ログイン後）
 * ダッシュボード・機能ページに適用
 * 今後、ナビゲーションバーやサイドバーを追加
 */
export default function MainLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr] bg-gray-50">
      <Header onMenuToggle={toggleSidebar} />
      <InlineStack
        alignItems="stretch"
        className="relative flex-1 min-h-0 overflow-hidden"
        gap="xs"
      >
        <aside
          className={cn(
            'flex flex-col overflow-y-auto py-2 px-4 border-r border-gray-200 bg-white shadow-xl transition-transform duration-200 ease-in-out lg:shadow-none',
            'fixed inset-y-0 left-0 z-40 w-64 transform lg:static lg:translate-x-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <SideMenu onNavigate={() => setSidebarOpen(false)} />
        </aside>
        <div className="flex-1 min-h-0 overflow-y-auto p-4 lg:p-6">
          {children}
        </div>
      </InlineStack>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          role="presentation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
