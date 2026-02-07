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
  updateTransaction,
  getTransaction,
  getTransactions,
  getTransactionsWithPagination,
  deleteTransaction,
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
  validateTransaction,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  CreateJournalEntryRequest,
  TransactionResponse,
} from '@/lib/api/transactions';
import { JournalEntry } from '@/types/journalEntry';
import { QueryClient } from '@tanstack/react-query';

// QueryClient インスタンス（必要に応じてシェア）
export const queryClient = new QueryClient();

const TRANSACTIONS_QUERY_KEY = ['transactions'];
const JOURNAL_ENTRIES_QUERY_KEY = ['journalEntries'];

/**
 * 取引作成の mutation
 * @returns mutation 結果
 */
export function useCreateTransaction(): UseMutationResult<
  TransactionResponse,
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
  });
}

/**
 * 取引更新の mutation
 * @returns mutation 結果
 */
export function useUpdateTransaction(): UseMutationResult<
  TransactionResponse,
  unknown,
  { id: number; request: UpdateTransactionRequest },
  unknown
> {
  return useMutation({
    mutationFn: async ({
      id,
      request,
    }: {
      id: number;
      request: UpdateTransactionRequest;
    }) => {
      const response = await updateTransaction(id, request);
      if (!response.data) {
        throw new Error(response.error || '取引の更新に失敗しました');
      }
      return response.data;
    },
    onSuccess: () => {
      // 取引一覧をリフェッチ
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_QUERY_KEY });
    },
  });
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
      queryClient.invalidateQueries({ queryKey: JOURNAL_ENTRIES_QUERY_KEY });
    },
  });
}

/**
 * 取引を取得（単独）
 * @param id - 取引ID
 * @returns query 結果
 */
export function useGetTransaction(
  id: number,
): UseQueryResult<TransactionResponse, unknown> {
  return useQuery({
    queryKey: [TRANSACTIONS_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getTransaction(id);
      if (!response.data) {
        throw new Error(response.error || '取引の取得に失敗しました');
      }
      return response.data;
    },
    staleTime: 0,
    enabled: id > 0,
  });
}

/**
 * 取引一覧の query
 * @returns query 結果
 */
export function useGetTransactions(): UseQueryResult<
  { transactions: TransactionResponse[] },
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
    staleTime: 0,
  });
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
    transactions: TransactionResponse[];
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

/**
 * 仕訳エントリー一覧を取得
 * @param transactionId - 取引ID
 * @returns query 結果
 */
export function useGetJournalEntries(
  transactionId: number,
): UseQueryResult<JournalEntry[], unknown> {
  return useQuery({
    queryKey: [JOURNAL_ENTRIES_QUERY_KEY, transactionId],
    queryFn: async () => {
      const response = await getJournalEntries(transactionId);
      if (!response.data) {
        throw new Error(response.error || '仕訳エントリーの取得に失敗しました');
      }
      return response.data;
    },
    staleTime: 0,
    enabled: transactionId > 0,
  });
}

/**
 * 仕訳エントリー作成の mutation
 * @returns mutation 結果
 */
export function useCreateJournalEntry(): UseMutationResult<
  JournalEntry,
  unknown,
  { transactionId: number; request: CreateJournalEntryRequest },
  unknown
> {
  return useMutation({
    mutationFn: async ({
      transactionId,
      request,
    }: {
      transactionId: number;
      request: CreateJournalEntryRequest;
    }) => {
      const response = await createJournalEntry(transactionId, request);
      if (!response.data) {
        throw new Error(response.error || '仕訳エントリーの作成に失敗しました');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // 仕訳一覧をリフェッチ
      queryClient.invalidateQueries({
        queryKey: [JOURNAL_ENTRIES_QUERY_KEY, data.transactionId],
      });
      // 取引一覧もリフェッチ
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}

/**
 * 仕訳エントリー更新の mutation
 * @returns mutation 結果
 */
export function useUpdateJournalEntry(): UseMutationResult<
  JournalEntry,
  unknown,
  { id: number; request: CreateJournalEntryRequest },
  unknown
> {
  return useMutation({
    mutationFn: async ({
      id,
      request,
    }: {
      id: number;
      request: CreateJournalEntryRequest;
    }) => {
      const response = await updateJournalEntry(id, request);
      if (!response.data) {
        throw new Error(response.error || '仕訳エントリーの更新に失敗しました');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // 仕訳一覧をリフェッチ
      queryClient.invalidateQueries({
        queryKey: [JOURNAL_ENTRIES_QUERY_KEY, data.transactionId],
      });
      // 取引一覧もリフェッチ
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}

/**
 * 仕訳エントリー削除の mutation
 * @returns mutation 結果
 */
export function useDeleteJournalEntry(): UseMutationResult<
  { message: string },
  unknown,
  { id: number; transactionId: number },
  unknown
> {
  return useMutation({
    mutationFn: async ({ id }: { id: number; transactionId: number }) => {
      const response = await deleteJournalEntry(id);
      if (!response.data) {
        throw new Error(response.error || '仕訳エントリーの削除に失敗しました');
      }
      return response.data;
    },
    onSuccess: (data, variables) => {
      // 仕訳一覧をリフェッチ
      queryClient.invalidateQueries({
        queryKey: [JOURNAL_ENTRIES_QUERY_KEY, variables.transactionId],
      });
      // 取引一覧もリフェッチ
      queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY });
    },
  });
}

/**
 * 取引のバランスを確認
 * @param transactionId - 取引ID
 * @returns query 結果
 */
export function useValidateTransaction(
  transactionId: number,
): UseQueryResult<{ transactionId: number; isValid: boolean }, unknown> {
  return useQuery({
    queryKey: ['validateTransaction', transactionId],
    queryFn: async () => {
      const response = await validateTransaction(transactionId);
      if (!response.data) {
        throw new Error(response.error || 'バランス検証に失敗しました');
      }
      return response.data;
    },
    staleTime: 0,
    enabled: transactionId > 0,
  });
}
