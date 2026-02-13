'use client';

import {
  useSuspenseQuery,
  UseSuspenseQueryResult,
} from '@tanstack/react-query';
import {
  getIncomeChartOfAccounts,
  getExpenseChartOfAccounts,
  getChartOfAccountsByTypes,
  type ChartOfAccount,
} from '@/lib/api/chartOfAccounts';

/**
 * 勘定科目取得用のカスタムフック (Suspense版)
 * TanStack Query を使用して、キャッシング・再フェッチ・エラーハンドリングを自動管理
 * Suspenseでデータ取得を待機させるため、useSuspenseQueryを使用
 */

/**
 * 収入勘定科目を取得 (Suspense版 - Suspenseで待機)
 * Suspenseで待機させたい場合、useQueryではなくこの関数を使用
 */
export function useSuspenseIncomeChartOfAccounts(): UseSuspenseQueryResult<
  ChartOfAccount[],
  Error
> {
  return useSuspenseQuery({
    queryKey: ['chartOfAccounts', 'income'],
    queryFn: async () => {
      const response = await getIncomeChartOfAccounts();

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data?.accounts || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 支出勘定科目を取得 (Suspense版 - Suspenseで待機)
 * Suspenseで待機させたい場合、useQueryではなくこの関数を使用
 */
export function useSuspenseExpenseChartOfAccounts(): UseSuspenseQueryResult<
  ChartOfAccount[],
  Error
> {
  return useSuspenseQuery({
    queryKey: ['chartOfAccounts', 'expense'],
    queryFn: async () => {
      const response = await getExpenseChartOfAccounts();

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data?.accounts || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * すべての勘定科目を取得 (Suspense版)
 * Suspenseで待機させたい場合、useQueryではなくこの関数を使用
 */
export function useAllChartOfAccounts(): UseSuspenseQueryResult<
  ChartOfAccount[],
  Error
> {
  return useSuspenseQuery({
    queryKey: ['chartOfAccounts', 'all'],
    queryFn: async () => {
      const response = await getChartOfAccountsByTypes([
        'asset',
        'liability',
        'equity',
        'revenue',
        'expense',
      ]);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data?.accounts || [];
    },
    staleTime: 5 * 60 * 1000,
  });
}
