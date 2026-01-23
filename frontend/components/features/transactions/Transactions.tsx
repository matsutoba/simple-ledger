'use client';

import { Button } from '@/components/ui/Button';
import { BlockStack, InlineStack } from '@/components/ui/Stack';
import { useState } from 'react';
import { Transaction, TransactionFilterCategory } from '@/types/transaction';
import { Typography } from '@/components/ui/Typography';
import { TransactionList } from './TransactionList';
import { TransactionFilterBar } from './TransactionFilterBar';
import { Icon } from '@/components/ui/Icon';
import { AddTransactionModal } from '../common/AddTransactionModal/AddTransactionModal';
import { useGetTransactions } from '@/hooks/useTransactions';

export const Tranasctions: React.FC = () => {
  const { data, isFetching } = useGetTransactions();
  const transactions: Transaction[] = data?.transactions || [];

  const [searchValue, setSearchValue] = useState('');
  const [categoryValue, setCategoryValue] =
    useState<TransactionFilterCategory>('all');
  const [isOpenAddTransactionModal, setIsOpenAddTransactionModal] =
    useState(false);

  return (
    <>
      <BlockStack gap="lg">
        <InlineStack alignItems="center" justifyContent="space-between">
          <Typography variant="2xl">取引一覧</Typography>
          <Button
            color="primary"
            onClick={() => setIsOpenAddTransactionModal(true)}
          >
            <Icon name="plus" />
            取引を追加
          </Button>
        </InlineStack>
        <TransactionFilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          categoryValue={categoryValue}
          onCategoryChange={setCategoryValue}
        />
        <TransactionList transactions={transactions} />
      </BlockStack>

      <AddTransactionModal
        open={isOpenAddTransactionModal}
        onClose={() => setIsOpenAddTransactionModal(false)}
        onExecute={() => setIsOpenAddTransactionModal(false)}
      />
    </>
  );
};
