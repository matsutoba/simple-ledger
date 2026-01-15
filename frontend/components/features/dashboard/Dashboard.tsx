'use client';

import { Button } from '@/components/ui/Button';
import { BlockStack, InlineStack } from '@/components/ui/Stack';
import { TrendCard } from './TrendCard';
import { BalanceTrendChart } from './BalanceTrendChart';
import { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { transactionData } from './testdata';
import { MonthlyBalanceChart } from './MonthlyBalanceChart';
import { RecentTransactionList } from './RecentTransactionList';
import { Typography } from '@/components/ui/Typography';
import { Icon } from '@/components/ui/Icon';

export const Dashboard: React.FC = () => {
  const [transactions, setTransactions] =
    useState<Transaction[]>(transactionData);

  return (
    <BlockStack gap="lg">
      <InlineStack alignItems="center" justifyContent="space-between">
        <Typography variant="2xl">ダッシュボード</Typography>
        <Button color="primary">
          <Icon name="plus" />
          取引を追加
        </Button>
      </InlineStack>
      <div className="w-full grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <TrendCard amount={750000} type="income" />
        <TrendCard amount={38500} type="expense" />
        <TrendCard amount={711500} type="balance" />
      </div>
      <BalanceTrendChart transactions={transactions} />
      <MonthlyBalanceChart transactions={transactions} />
      <RecentTransactionList transactions={transactions} />
    </BlockStack>
  );
};
