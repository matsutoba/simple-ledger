/**
 * 取引 API
 * バックエンド API との連携を担当
 */

import { apiClient, ApiResponse } from './client';
import { Transaction } from '@/types/transaction';

export interface CreateTransactionRequest {
  date: string;
  chartOfAccountsId: number;
  amount: number;
  description: string;
}

export interface CreateTransactionResponse {
  id: number;
  userId: number;
  date: string;
  chartOfAccountsId: number;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 取引を作成
 * @param request - 取引作成リクエスト
 * @returns 作成された取引
 */
export async function createTransaction(
  request: CreateTransactionRequest,
): Promise<ApiResponse<CreateTransactionResponse>> {
  return apiClient.post<CreateTransactionResponse>('/api/transactions', {
    ...request,
  });
}

/**
 * ユーザーの取引一覧を取得
 * @returns ユーザーの取引一覧
 */
export async function getTransactions(): Promise<
  ApiResponse<{ transactions: Transaction[] }>
> {
  return apiClient.get<{ transactions: Transaction[] }>('/api/transactions');
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

export type { Transaction };
