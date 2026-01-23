'use client';

import {
  useMutation,
  useQuery,
  useInfiniteQuery,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import {
  createTransaction,
  getTransactions,
  getTransactionsWithPagination,
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

/**
 * 無限スクロール対応の取引一覧 query
 * @param pageSize - 1ページあたりの件数（デフォルト: 20）
 * @param keyword - 検索キーワード（オプション）
 * @returns infinite query 結果
 */
export function useGetInfinityTransactions(
  pageSize: number = 20,
  keyword?: string,
) {
  type PageData = {
    transactions: Transaction[];
    total: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
  };

  return useInfiniteQuery<
    PageData,
    unknown,
    { pages: PageData[] },
    string[],
    number
  >({
    queryKey: ['transactions', 'infinite', String(pageSize), keyword ?? ''],
    queryFn: async ({ pageParam }) => {
      const response = await getTransactionsWithPagination(
        pageParam,
        pageSize,
        keyword,
      );
      if (!response.data) {
        throw new Error(response.error || '取引の取得に失敗しました');
      }
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60,
  });
}
