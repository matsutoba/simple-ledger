'use client';

import { Button } from '@/components/ui/Button';
import { BlockStack, InlineStack } from '@/components/ui/Stack';
import { useState } from 'react';
import { Transaction, TransactionFilterCategory } from '@/types/transaction';
import { Typography } from '@/components/ui/Typography';
import { transactionData } from '../dashboard/testdata';
import { TransactionList } from './TransactionList';
import { TransactionFilterBar } from './TransactionFilterBar';
import { AmountCard } from '../common/AmountCard';

export const Tranasctions: React.FC = () => {
  const [transactions, setTransactions] =
    useState<Transaction[]>(transactionData);
  const [searchValue, setSearchValue] = useState('');
  const [categoryValue, setCategoryValue] =
    useState<TransactionFilterCategory>('all');

  return (
    <BlockStack gap="lg">
      <InlineStack alignItems="center" justifyContent="space-between">
        <Typography variant="medium">取引一覧</Typography>
        <Button color="primary">取引を追加</Button>
      </InlineStack>
      <TransactionFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        categoryValue={categoryValue}
        onCategoryChange={setCategoryValue}
      />
      <div className="w-full grid grid-cols-1 gap-2 grid-cols-3">
        <AmountCard amount={750000} type="income" />
        <AmountCard amount={38500} type="expense" />
        <AmountCard amount={711500} type="balance" />
      </div>
      <TransactionList transactions={transactions} />
    </BlockStack>
  );
};
