'use client';

import {
  useMutation,
  useQuery,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
  CreateTransactionRequest,
  CreateTransactionResponse,
  Transaction,
} from '@/lib/api/transactions';
import { QueryClient } from '@tanstack/react-query';

// QueryClient インスタンス（必要に応じてシェア）
export const queryClient = new QueryClient();

const TRANSACTIONS_QUERY_KEY = ['transactions'];

/**
 * 取引作成の mutation
 * @returns mutation 結果
 */
export function useCreateTransaction(): UseMutationResult<
  CreateTransactionResponse,
  unknown,
  CreateTransactionRequest,
  unknown
> {
  return useMutation({
    mutationFn: async (request: CreateTransactionRequest) => {
      const response = await createTransaction(request);
      if (!response.data) {
        throw new Error(response.error || '取引の作成に失敗しました');
      }
      return response.data;
    },
    onSuccess: () => {
      // 取引一覧をリフェッチ
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  }) as UseMutationResult<
    CreateTransactionResponse,
    unknown,
    CreateTransactionRequest,
    unknown
  >;
}

/**
 * 取引削除の mutation
 * @returns mutation 結果
 */
export function useDeleteTransaction(): UseMutationResult<
  { message: string },
  unknown,
  number,
  unknown
> {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteTransaction(id);
      if (!response.data) {
        throw new Error(response.error || '取引の削除に失敗しました');
      }
      return response.data;
    },
    onSuccess: () => {
      // 取引一覧をリフェッチ
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  }) as UseMutationResult<{ message: string }, unknown, number, unknown>;
}

/**
 * 取引一覧の query
 * @returns query 結果
 */
export function useGetTransactions(): UseQueryResult<
  { transactions: Transaction[] },
  unknown
> {
  return useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: async () => {
      const response = await getTransactions();
      if (!response.data) {
        throw new Error(response.error || '取引の取得に失敗しました');
      }
      return response.data;
    },
    staleTime: 1000 * 60, // 1分間キャッシュを保持
  }) as UseQueryResult<{ transactions: Transaction[] }, unknown>;
}
