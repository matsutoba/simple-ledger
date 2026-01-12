export type TransactionType = 'income' | 'expense';
export type TrendType = TransactionType | 'balance';

export interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: TransactionType;
}

export type TransactionFilterCategory = TransactionType | 'all';
