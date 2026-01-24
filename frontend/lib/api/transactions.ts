/**
 * 取引 API
 * バックエンド API との連携を担当
 */

import { apiClient, ApiResponse } from './client';
import { Transaction } from '@/types/transaction';
import { JournalEntry, EntryType } from '@/types/journalEntry';

/**
 * 仕訳エントリーリクエスト型
 */
export interface CreateJournalEntryRequest {
  chartOfAccountsId: number;
  type: EntryType;
  amount: number;
  description: string;
}

/**
 * 取引作成リクエスト型
 */
export interface CreateTransactionRequest {
  date: string;
  description: string;
  journalEntries: CreateJournalEntryRequest[];
}

/**
 * 取引レスポンス型
 */
export interface TransactionResponse extends Transaction {
  journalEntries?: JournalEntry[];
}

/**
 * 取引更新リクエスト型
 */
export interface UpdateTransactionRequest {
  date: string;
  description: string;
  journalEntries: CreateJournalEntryRequest[];
}

/**
 * 取引を作成
 * @param request - 取引作成リクエスト
 * @returns 作成された取引
 */
export async function createTransaction(
  request: CreateTransactionRequest,
): Promise<ApiResponse<TransactionResponse>> {
  return apiClient.post<TransactionResponse>('/api/transactions', {
    ...request,
  });
}

/**
 * 取引を更新
 * @param id - 取引ID
 * @param request - 取引更新リクエスト
 * @returns 更新された取引
 */
export async function updateTransaction(
  id: number,
  request: UpdateTransactionRequest,
): Promise<ApiResponse<TransactionResponse>> {
  return apiClient.put<TransactionResponse>(`/api/transactions/${id}`, {
    ...request,
  });
}

/**
 * 取引を取得（単独）
 * @param id - 取引ID
 * @returns 取引情報
 */
export async function getTransaction(
  id: number,
): Promise<ApiResponse<TransactionResponse>> {
  return apiClient.get<TransactionResponse>(`/api/transactions/${id}`);
}

/**
 * ユーザーの取引一覧を取得
 * @returns ユーザーの取引一覧
 */
export async function getTransactions(): Promise<
  ApiResponse<{ transactions: TransactionResponse[] }>
> {
  return apiClient.get<{ transactions: TransactionResponse[] }>(
    '/api/transactions',
  );
}

/**
 * ユーザーの取引一覧をページネーション付きで取得
 * @param page - ページ番号（1から始まる）
 * @param pageSize - 1ページあたりの件数
 * @param keyword - 検索キーワード（オプション）
 * @returns ページネーション付き取引一覧
 */
export async function getTransactionsWithPagination(
  page: number,
  pageSize: number,
  keyword?: string,
): Promise<
  ApiResponse<{
    transactions: TransactionResponse[];
    total: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
  }>
> {
  const params: Record<string, string | number> = { page, pageSize };
  if (keyword) {
    params.keyword = keyword;
  }

  return apiClient.get<{
    transactions: TransactionResponse[];
    total: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
  }>('/api/transactions/paginated', {
    params,
  });
}

/**
 * 取引を削除
 * @param id - 取引ID
 * @returns 削除結果
 */
export async function deleteTransaction(
  id: number,
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<{ message: string }>(`/api/transactions/${id}`);
}

/**
 * 仕訳エントリーを取得
 * @param transactionId - 取引ID
 * @returns 仕訳エントリー一覧
 */
export async function getJournalEntries(
  transactionId: number,
): Promise<ApiResponse<JournalEntry[]>> {
  return apiClient.get<JournalEntry[]>(
    `/api/journal-entries/transactions/${transactionId}`,
  );
}

/**
 * 仕訳エントリーを作成
 * @param transactionId - 取引ID
 * @param request - 仕訳エントリー作成リクエスト
 * @returns 作成された仕訳エントリー
 */
export async function createJournalEntry(
  transactionId: number,
  request: CreateJournalEntryRequest,
): Promise<ApiResponse<JournalEntry>> {
  return apiClient.post<JournalEntry>(
    `/api/journal-entries/transactions/${transactionId}`,
    {
      ...request,
    },
  );
}

/**
 * 仕訳エントリーを更新
 * @param id - 仕訳エントリーID
 * @param request - 仕訳エントリー更新リクエスト
 * @returns 更新された仕訳エントリー
 */
export async function updateJournalEntry(
  id: number,
  request: CreateJournalEntryRequest,
): Promise<ApiResponse<JournalEntry>> {
  return apiClient.put<JournalEntry>(`/api/journal-entries/${id}`, {
    ...request,
  });
}

/**
 * 仕訳エントリーを削除
 * @param id - 仕訳エントリーID
 * @returns 削除結果
 */
export async function deleteJournalEntry(
  id: number,
): Promise<ApiResponse<{ message: string }>> {
  return apiClient.delete<{ message: string }>(`/api/journal-entries/${id}`);
}

/**
 * 取引のバランスを確認
 * @param transactionId - 取引ID
 * @returns バランス検証結果
 */
export async function validateTransaction(
  transactionId: number,
): Promise<ApiResponse<{ transactionId: number; isValid: boolean }>> {
  return apiClient.get<{ transactionId: number; isValid: boolean }>(
    `/api/journal-entries/transactions/${transactionId}/validate`,
  );
}

export type { Transaction, TransactionResponse };
