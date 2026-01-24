import { JournalEntry } from './journalEntry';

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
  description: string;
  journalEntries?: JournalEntry[];
  createdAt: string;
  updatedAt: string;
}

export type TransactionFilterCategory = TransactionType | 'all';

export interface TransactionCategoryDataItem {
  type: ChartOfAccountsType;
  value: number;
}

export interface TransactionCategoryData {
  incomeData: TransactionCategoryDataItem[];
  expenseData: TransactionCategoryDataItem[];
}
