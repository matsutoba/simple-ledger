/**
 * 勘定科目の型定義
 */

/**
 * 勘定科目区分
 */
export type AccountType =
  | 'asset'
  | 'liability'
  | 'equity'
  | 'revenue'
  | 'expense';

/**
 * 通常残高
 */
export type NormalBalance = 'debit' | 'credit';

/**
 * 勘定科目
 */
export interface ChartOfAccount {
  id: number;
  code: string;
  name: string;
  type: AccountType;
  normalBalance: NormalBalance;
  description: string;
  isActive: boolean;
}

/**
 * 勘定科目一覧取得のレスポンス
 */
export interface GetChartOfAccountsResponse {
  accounts: ChartOfAccount[];
  total: number;
}
