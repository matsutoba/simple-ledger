'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

/**
 * QueryClient の設定
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // キャッシュ時間：5分
      staleTime: 5 * 60 * 1000,
      // ガベージコレクション時間：10分
      gcTime: 10 * 60 * 1000,
      // 初回マウント時にリフェッチしない
      refetchOnMount: false,
      // ウィンドウフォーカス時にリフェッチしない
      refetchOnWindowFocus: false,
      // リトライ：本番環境で有効、開発環境は無効
      retry: process.env.NODE_ENV === 'production' ? 3 : false,
    },
  },
});

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * TanStack Query プロバイダー
 * アプリケーション全体で使用可能にする
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
