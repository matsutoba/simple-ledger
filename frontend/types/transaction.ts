export type TransactionType = 'income' | 'expense';
export type TrendType = TransactionType | 'balance';

export interface Transaction {
  id: number;
  userId: number;
  date: string;
  chartOfAccountsId: number;
  chartOfAccountsCode: string;
  chartOfAccountsName: string;
  chartOfAccountsType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  amount: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionFilterCategory = TransactionType | 'all';

export interface TransactionCategoryDataItem {
  name: string;
  value: number;
}

export interface TransactionCategoryData {
  incomeData: TransactionCategoryDataItem[];
  expenseData: TransactionCategoryDataItem[];
}
