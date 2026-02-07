import { AccountType } from '@/types/chartOfAccount';
import { Transaction } from '@/types/transaction';

/**
 * 勘定科目タイプが収入関連（資産、純資産、収益）かどうかを判定
 * @param type 勘定科目タイプ
 * @returns 収入関連の場合true
 */
export const isIncomeType = (type: AccountType): boolean => {
  return type === 'asset' || type === 'equity' || type === 'revenue';
};

/**
 * 勘定科目タイプが支出関連（負債、費用）かどうかを判定
 * @param type 勘定科目タイプ
 * @returns 支出関連の場合true
 */
export const isExpenseType = (type: AccountType): boolean => {
  return !isIncomeType(type);
};

/**
 * 取引一覧から収支を計算（複式簿記データに基づく）
 * @param transactions 取引一覧
 * @returns 総収入、総支出、残高
 */
export const calculateBalance = (transactions: Transaction[]) => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    if (!tx.journalEntries) return;

    tx.journalEntries.forEach((entry) => {
      const accountType = entry.chartOfAccounts.type;

      // 収益は貸方（credit）で記録される
      if (accountType === 'revenue' && entry.type === 'credit') {
        totalIncome += entry.amount;
      }

      // 費用は借方（debit）で記録される
      if (accountType === 'expense' && entry.type === 'debit') {
        totalExpense += entry.amount;
      }
    });
  });

  const balance = totalIncome - totalExpense;

  return { totalIncome, totalExpense, balance };
};
