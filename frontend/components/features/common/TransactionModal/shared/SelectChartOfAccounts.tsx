'use client';

import { Select } from '@/components/ui/Select';
import { ChartOfAccount } from '@/types/chartOfAccount';
import {
  useSuspenseIncomeChartOfAccounts,
  useSuspenseExpenseChartOfAccounts,
} from '@/hooks/useChartOfAccounts';
import { TransactionType } from '@/types/transaction';

interface SelectChartOfAccountsProps {
  type: TransactionType;
  category: string;
  onCategoryChange: (value: string) => void;
  errorMessage?: string;
}

/**
 * Suspenseでラップされた勘定科目選択コンポーネント
 * フックでデータを取得し、Suspenseで待機状態を管理
 */
export const SelectChartOfAccounts: React.FC<SelectChartOfAccountsProps> = ({
  type,
  category,
  onCategoryChange,
  errorMessage,
}) => {
  // Suspenseで待機する（データが返されるまで）
  const { data: incomeAccounts } = useSuspenseIncomeChartOfAccounts();
  const { data: expenseAccounts } = useSuspenseExpenseChartOfAccounts();

  // 現在の種別に応じてアカウント一覧を取得
  const accounts = type === 'income' ? incomeAccounts : expenseAccounts;

  // ChartOfAccountsデータをSelectコンポーネント用に変換
  const options = accounts.map((account: ChartOfAccount) => ({
    label: `${account.code}: ${account.name}`,
    value: account.id.toString(),
  }));

  return (
    <Select
      label="勘定科目"
      placeholder="選択してください"
      options={options}
      value={category}
      onChange={(value: string) => {
        onCategoryChange(value);
      }}
      errorMessage={errorMessage}
    />
  );
};
