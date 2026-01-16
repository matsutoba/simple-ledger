'use client';

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  getChartOfAccountsByTypes,
  getIncomeChartOfAccounts,
  getExpenseChartOfAccounts,
  type AccountType,
  type ChartOfAccount,
} from '@/lib/api/chartOfAccounts';

/**
 * 勘定科目取得用のカスタムフック
 * TanStack Query を使用して、キャッシング・再フェッチ・エラーハンドリングを自動管理
 */

/**
 * 指定された種別の勘定科目を取得
 * @param types - 取得する勘定科目区分
 * @param enabled - クエリの実行可否（デフォルト: true）
 */
export function useChartOfAccounts(
  types: AccountType[],
  enabled: boolean = true,
): UseQueryResult<ChartOfAccount[], Error> {
  return useQuery({
    queryKey: ['chartOfAccounts', types.sort().join(',')],
    queryFn: async () => {
      const response = await getChartOfAccountsByTypes(types);

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data?.accounts || [];
    },
    enabled: enabled && types.length > 0,
    staleTime: 5 * 60 * 1000, // 5分間はキャッシュを使用
  });
}

/**
 * 収入勘定科目を取得
 * @param enabled - クエリの実行可否（デフォルト: true）
 */
export function useIncomeChartOfAccounts(
  enabled: boolean = true,
): UseQueryResult<ChartOfAccount[], Error> {
  return useQuery({
    queryKey: ['chartOfAccounts', 'income'],
    queryFn: async () => {
      const response = await getIncomeChartOfAccounts();

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data?.accounts || [];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * 支出勘定科目を取得
 * @param enabled - クエリの実行可否（デフォルト: true）
 */
export function useExpenseChartOfAccounts(
  enabled: boolean = true,
): UseQueryResult<ChartOfAccount[], Error> {
  return useQuery({
    queryKey: ['chartOfAccounts', 'expense'],
    queryFn: async () => {
      const response = await getExpenseChartOfAccounts();

      if (response.error) {
        throw new Error(response.error);
      }

      return response.data?.accounts || [];
    },
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
