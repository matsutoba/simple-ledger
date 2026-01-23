'use client';

import { BlockStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { AmountCard } from '../common/AmountCard';
import { Transaction, TransactionCategoryData } from '@/types/transaction';
import { useMemo } from 'react';
import { CountCard } from './CountCard';
import { ExpenseTop5BarChart } from './ExpenseTop5BarChart';
import { CategoryList } from './CategoryList';
import { CategoryPieChart } from './CategoryPieChart';
import { isIncomeType } from '@/lib/utils/accountType';
import { useGetTransactions } from '@/hooks/useTransactions';

export const Analytics: React.FC = () => {
  const { data } = useGetTransactions();
  const transactions: Transaction[] = useMemo(
    () => data?.transactions || [],
    [data?.transactions],
  );

  const categoryData: TransactionCategoryData = useMemo(() => {
    const incomeByCategory: { [key: string]: number } = {};
    const expenseByCategory: { [key: string]: number } = {};

    transactions.forEach((t) => {
      if (isIncomeType(t.chartOfAccountsType)) {
        incomeByCategory[t.description] =
          (incomeByCategory[t.description] || 0) + t.amount;
      } else {
        expenseByCategory[t.description] =
          (expenseByCategory[t.description] || 0) + t.amount;
      }
    });

    const incomeData = Object.entries(incomeByCategory).map(
      ([name, value]) => ({
        name,
        value,
      }),
    );

    const expenseData = Object.entries(expenseByCategory).map(
      ([name, value]) => ({
        name,
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
        <AmountCard amount={1200000} type="income" />
        <AmountCard amount={450000} type="expense" />
        <AmountCard amount={750000} type="balance" />
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

      <ExpenseTop5BarChart data={categoryData.expenseData} />

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
