import { AccountType } from './chartOfAccount';

export type TransactionType = 'income' | 'expense';
export type TrendType = TransactionType | 'balance';
export type ChartOfAccountsType =
  | 'asset'
  | 'liability'
  | 'equity'
  | 'revenue'
  | 'expense';

export interface Transaction {
  id: number;
  userId: number;
  date: string;
  chartOfAccountsId: number;
  chartOfAccountsCode: string;
  chartOfAccountsName: string;
  chartOfAccountsType: ChartOfAccountsType;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionFilterCategory = TransactionType | 'all';

export interface TransactionCategoryDataItem {
  type: AccountType;
  value: number;
}

export interface TransactionCategoryData {
  incomeData: TransactionCategoryDataItem[];
  expenseData: TransactionCategoryDataItem[];
}
