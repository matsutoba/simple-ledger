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
import { calculateBalance } from '@/lib/utils/accountType';
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
      // 複式簿記のjournalEntriesから勘定科目別に集計
      if (t.journalEntries) {
        t.journalEntries.forEach((entry) => {
          const accountType = entry.chartOfAccounts.type;

          // 収益、資産、純資産を収入に分類
          if (
            accountType === 'revenue' ||
            accountType === 'asset' ||
            accountType === 'equity'
          ) {
            incomeByCategory[accountType as IncomeType] =
              (incomeByCategory[accountType as IncomeType] || 0) + entry.amount;
          }
          // 負債、費用を支出に分類
          else if (accountType === 'expense' || accountType === 'liability') {
            expenseByCategory[accountType as ExpenseType] =
              (expenseByCategory[accountType as ExpenseType] || 0) +
              entry.amount;
          }
        });
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
      <div className="w-full grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
