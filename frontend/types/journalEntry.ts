/**
 * 仕訳エントリー型定義
 */

export type EntryType = 'debit' | 'credit';

export interface ChartOfAccounts {
  id: number;
  code: string;
  name: string;
  type: AccountType;
  normalBalance: NormalBalance;
}

export interface JournalEntry {
  id: number;
  transactionId: number;
  chartOfAccountsId: number;
  chartOfAccounts: ChartOfAccounts;
  type: EntryType;
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type AccountType =
  | 'asset'
  | 'liability'
  | 'equity'
  | 'revenue'
  | 'expense';
export type NormalBalance = 'debit' | 'credit';
