import { AccountType } from '@/types/chartOfAccount';

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
