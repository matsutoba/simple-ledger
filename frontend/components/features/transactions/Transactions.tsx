'use client';

import { Button } from '@/components/ui/Button';
import { BlockStack, InlineStack } from '@/components/ui/Stack';
import { useState, useEffect, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { Transaction, TransactionFilterCategory } from '@/types/transaction';
import { Typography } from '@/components/ui/Typography';
import { TransactionList } from './TransactionList';
import { TransactionFilterBar } from './TransactionFilterBar';
import { Icon } from '@/components/ui/Icon';
import { AddTransactionModal } from '../common/AddTransactionModal/AddTransactionModal';
import { useGetInfinityTransactions } from '@/hooks/useTransactions';
import { Spinner } from '@/components/ui/Spinner';

export const Tranasctions: React.FC = () => {
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useGetInfinityTransactions(50);

  const { ref: observerTarget, inView } = useInView({
    threshold: 0.1,
  });

  const [searchValue, setSearchValue] = useState('');
  const [categoryValue, setCategoryValue] =
    useState<TransactionFilterCategory>('all');
  const [isOpenAddTransactionModal, setIsOpenAddTransactionModal] =
    useState(false);

  // 全ページのトランザクションを統合して重複を除外
  const transactions: Transaction[] = useMemo(() => {
    if (!data?.pages) return [];

    const seen = new Set<number>();
    return data.pages
      .flatMap((page) => page.transactions)
      .filter((tx) => {
        if (seen.has(tx.id)) return false;
        seen.add(tx.id);
        return true;
      });
  }, [data?.pages]);

  // useInView を使用した無限スクロール
  useEffect(() => {
    if (inView && hasNextPage && !isFetching && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage]);

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

        {/* 無限スクロール検出用の要素 */}
        <div ref={observerTarget} className="py-8 flex justify-center">
          {isFetchingNextPage && <Spinner />}
          {!hasNextPage && transactions.length > 0 && (
            <Typography className="text-gray-500">
              すべての取引を読み込みました
            </Typography>
          )}
        </div>
      </BlockStack>

      <AddTransactionModal
        open={isOpenAddTransactionModal}
        onClose={() => setIsOpenAddTransactionModal(false)}
        onExecute={() => setIsOpenAddTransactionModal(false)}
      />
    </>
  );
};
