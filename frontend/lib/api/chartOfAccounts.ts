/**
 * 勘定科目 API
 * バックエンド API との連携を担当
 */

import { apiClient, ApiResponse } from './client';
import type {
  AccountType,
  ChartOfAccount,
  GetChartOfAccountsResponse,
} from '@/types/chartOfAccount';

/**
 * 勘定科目を種別で取得
 * @param types - 取得する勘定科目区分（複数指定可）
 * @returns 勘定科目一覧
 */
export async function getChartOfAccountsByTypes(
  types: AccountType[],
): Promise<ApiResponse<GetChartOfAccountsResponse>> {
  // クエリパラメータを構築
  const queryParams = types.map((type) => `types=${type}`).join('&');
  const path = `/chart-of-accounts?${queryParams}`;

  return apiClient.get<GetChartOfAccountsResponse>(path);
}

/**
 * 収入勘定科目を取得
 */
export async function getIncomeChartOfAccounts(): Promise<
  ApiResponse<GetChartOfAccountsResponse>
> {
  return getChartOfAccountsByTypes(['revenue', 'asset']);
}

/**
 * 支出勘定科目を取得
 */
export async function getExpenseChartOfAccounts(): Promise<
  ApiResponse<GetChartOfAccountsResponse>
> {
  return getChartOfAccountsByTypes(['expense']);
}

// 型を再エクスポート（使用側での import を簡潔に）
export type { AccountType, ChartOfAccount, GetChartOfAccountsResponse };
