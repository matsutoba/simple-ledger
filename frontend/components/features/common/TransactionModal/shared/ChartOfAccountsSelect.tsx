'use client';

import {
  useSuspenseIncomeChartOfAccounts,
  useSuspenseExpenseChartOfAccounts,
} from '@/hooks/useChartOfAccounts';

interface ChartOfAccountsSelectProps {
  value: string;
  onChange: (value: string) => void;
  side: 'debit' | 'credit';
  className?: string;
}

/**
 * 勘定科目セレクトコンポーネント（借方側）
 */
export const DebitChartOfAccountsSelect: React.FC<
  ChartOfAccountsSelectProps
> = ({ value, onChange, className = '' }) => {
  const { data: accounts } = useSuspenseIncomeChartOfAccounts();

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

/**
 * 勘定科目セレクトコンポーネント（貸方側）
 */
export const CreditChartOfAccountsSelect: React.FC<
  ChartOfAccountsSelectProps
> = ({ value, onChange, className = '' }) => {
  const { data: accounts } = useSuspenseExpenseChartOfAccounts();

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
