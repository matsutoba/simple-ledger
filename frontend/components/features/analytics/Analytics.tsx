'use client';

import { BlockStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { AmountCard } from '../common/AmountCard';
import { Transaction, TransactionCategoryData } from '@/types/transaction';
import type { AccountType } from '@/types/chartOfAccount';
import { useMemo } from 'react';
import { CountCard } from './CountCard';
import { CategoryList } from './CategoryList';
import { CategoryPieChart } from './CategoryPieChart';
import { calculateBalance, isIncomeType } from '@/lib/utils/accountType';
import { useGetTransactions } from '@/hooks/useTransactions';

type IncomeType = Extract<AccountType, 'asset' | 'equity' | 'revenue'>;
type ExpenseType = Exclude<AccountType, IncomeType>;

export const Analytics: React.FC = () => {
  const { data } = useGetTransactions();
  const transactions: Transaction[] = useMemo(
    () => data?.transactions || [],
    [data?.transactions],
  );

  const { totalIncome, totalExpense, balance } = useMemo(
    () => calculateBalance(transactions),
    [transactions],
  );

  // カテゴリ別データの集計
  const categoryData: TransactionCategoryData = useMemo(() => {
    const incomeByCategory: Record<IncomeType, number> = {
      asset: 0,
      equity: 0,
      revenue: 0,
    };
    const expenseByCategory: Record<ExpenseType, number> = {
      liability: 0,
      expense: 0,
    };

    transactions.forEach((t) => {
      if (isIncomeType(t.chartOfAccountsType)) {
        incomeByCategory[t.chartOfAccountsType as IncomeType] =
          (incomeByCategory[t.chartOfAccountsType as IncomeType] || 0) +
          t.amount;
      } else {
        expenseByCategory[t.chartOfAccountsType as ExpenseType] =
          (expenseByCategory[t.chartOfAccountsType as ExpenseType] || 0) +
          t.amount;
      }
    });

    const incomeData = Object.entries(incomeByCategory).map(
      ([name, value]) => ({
        type: name as IncomeType,
        value,
      }),
    );

    const expenseData = Object.entries(expenseByCategory).map(
      ([name, value]) => ({
        type: name as ExpenseType,
        value,
      }),
    );

    return { incomeData, expenseData };
  }, [transactions]);

  return (
    <BlockStack gap="lg">
      <Typography variant="2xl">分析・レポート</Typography>
      <div className="w-full grid grid-cols-4 gap-4">
        <CountCard count={transactions.length} />
        <AmountCard amount={totalIncome} type="income" />
        <AmountCard amount={totalExpense} type="expense" />
        <AmountCard amount={balance} type="balance" />
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <CategoryPieChart
          title="カテゴリー別収入"
          data={categoryData.incomeData}
        />
        <CategoryPieChart
          title="カテゴリー別支出"
          data={categoryData.expenseData}
        />
      </div>

      <div className="w-full grid grid-cols-2 gap-4">
        <CategoryList
          type="income"
          title="収入カテゴリ詳細"
          data={categoryData.incomeData}
        />
        <CategoryList
          type="expense"
          title="支出カテゴリ詳細"
          data={categoryData.expenseData}
        />
      </div>
    </BlockStack>
  );
};
