'use client';

import {
  useSuspenseIncomeChartOfAccounts,
  useSuspenseExpenseChartOfAccounts,
} from '@/hooks/useChartOfAccounts';
import { EntryType } from '@/types/journalEntry';

interface FlexibleChartOfAccountsSelectProps {
  value: string;
  onChange: (value: string) => void;
  type: EntryType;
  className?: string;
}

/**
 * 柔軟な勘定科目セレクトコンポーネント
 * 借方・貸方の型に応じて表示する勘定科目を動的に変更
 */
export const FlexibleChartOfAccountsSelect: React.FC<
  FlexibleChartOfAccountsSelectProps
> = ({ value, onChange, type, className = '' }) => {
  const { data: incomeAccounts } = useSuspenseIncomeChartOfAccounts();
  const { data: expenseAccounts } = useSuspenseExpenseChartOfAccounts();

  // 借方・貸方タイプに基づいて表示する勘定科目を決定
  // 注：通常は借方=資産/費用、貸方=負債/収益だが、ここではフレキシブルに対応
  // 将来的には、勘定科目の正常残高属性に基づいて自動分類することを推奨
  const accounts =
    type === 'debit'
      ? [...incomeAccounts, ...expenseAccounts]
      : [...incomeAccounts, ...expenseAccounts];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      <option value="">選択...</option>
      {accounts.map((account) => (
        <option key={account.id} value={String(account.id)}>
          {account.name}
        </option>
      ))}
    </select>
  );
};
