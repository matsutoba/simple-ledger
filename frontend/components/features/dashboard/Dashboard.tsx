'use client';

import { Button } from '@/components/ui/Button';
import { BlockStack, InlineStack } from '@/components/ui/Stack';
import { TrendCard } from './TrendCard';
import { BalanceTrendChart } from './BalanceTrendChart';
import { useState } from 'react';
import { MonthlyBalanceChart } from './MonthlyBalanceChart';
import { RecentTransactionList } from './RecentTransactionList';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';
import { AddTransactionModal } from '../common/AddTransactionModal/AddTransactionModal';
import { useGetTransactions } from '@/hooks/useTransactions';
import { Spinner } from '@/components/ui/Spinner';
import { Transaction } from '@/types/transaction';
import { isIncomeType } from '@/lib/utils/accountType';

export const Dashboard: React.FC = () => {
  const [isOpenAddTransactionModal, setIsOpenAddTransactionModal] =
    useState(false);

  const { data, isFetching } = useGetTransactions();
  const transactions: Transaction[] = data?.transactions || [];

  // 総収入の計算
  const totalIncome = transactions
    .filter((tx) => isIncomeType(tx.chartOfAccountsType))
    .reduce((sum, tx) => sum + tx.amount, 0);

  // 総支出の計算
  const totalExpense = transactions
    .filter((tx) => !isIncomeType(tx.chartOfAccountsType))
    .reduce((sum, tx) => sum + tx.amount, 0);

  // 残高の計算
  const balance = Math.abs(totalIncome - totalExpense);

  return (
    <>
      {isFetching && <Spinner fullscreen />}
      <BlockStack gap="lg">
        <InlineStack alignItems="center" justifyContent="space-between">
          <Typography variant="2xl">ダッシュボード</Typography>
          <Button
            color="primary"
            onClick={() => setIsOpenAddTransactionModal(true)}
          >
            <Icon name="plus" />
            取引を追加
          </Button>
        </InlineStack>
        <div className="w-full grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <TrendCard amount={totalIncome} type="income" />
          <TrendCard amount={totalExpense} type="expense" />
          <TrendCard amount={balance} type="balance" />
        </div>
        <BalanceTrendChart transactions={transactions} />
        <MonthlyBalanceChart transactions={transactions} />
        <RecentTransactionList transactions={transactions} />
      </BlockStack>

      <AddTransactionModal
        open={isOpenAddTransactionModal}
        onClose={() => setIsOpenAddTransactionModal(false)}
        onExecute={() => setIsOpenAddTransactionModal(false)}
      />
    </>
  );
};
