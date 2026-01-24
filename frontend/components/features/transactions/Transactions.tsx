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
import { AddTransactionModal } from '../common/TransactionModal/AddTransactionModal';
import { EditTransactionModal } from '../common/TransactionModal/EditTransactionModal';
import { useGetInfinityTransactions } from '@/hooks/useTransactions';
import { useDebounce } from '@/hooks/useDebounce';
import { Spinner } from '@/components/ui/Spinner';
import { isIncomeType } from '@/lib/utils/accountType';

export const Tranasctions: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedKeyword = useDebounce(searchValue, 500);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
  } = useGetInfinityTransactions(50, debouncedKeyword || undefined);

  const { ref: observerTarget, inView } = useInView({
    threshold: 0.1,
  });

  const [categoryValue, setCategoryValue] =
    useState<TransactionFilterCategory>('all');
  const [isOpenAddTransactionModal, setIsOpenAddTransactionModal] =
    useState(false);
  const [isOpenEditTransactionModal, setIsOpenEditTransactionModal] =
    useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  // 全ページのトランザクションを統合して重複を除外し、categoryValueに基づいてフィルタ
  const transactions: Transaction[] = useMemo(() => {
    if (!data?.pages) return [];

    const seen = new Set<number>();
    const allTransactions = data.pages
      .flatMap((page) => page.transactions || [])
      .filter((tx) => {
        if (!tx || seen.has(tx.id)) return false;
        seen.add(tx.id);
        return true;
      });

    if (categoryValue === 'all') {
      return allTransactions;
    }
    if (categoryValue === 'income') {
      return allTransactions.filter((tx) =>
        isIncomeType(tx.chartOfAccountsType),
      );
    }
    if (categoryValue === 'expense') {
      return allTransactions.filter(
        (tx) => !isIncomeType(tx.chartOfAccountsType),
      );
    }
    return allTransactions;
  }, [data, categoryValue]);

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
        <TransactionList
          transactions={transactions}
          onEditClick={(tx) => {
            setSelectedTransaction(tx);
            setIsOpenEditTransactionModal(true);
          }}
        />

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
        onSuccess={() => {
          setIsOpenAddTransactionModal(false);
          refetch();
        }}
      />

      {selectedTransaction && (
        <EditTransactionModal
          open={isOpenEditTransactionModal}
          transactionId={selectedTransaction.id}
          initialData={{
            type: isIncomeType(selectedTransaction.chartOfAccountsType)
              ? 'income'
              : 'expense',
            date: selectedTransaction.date,
            category: selectedTransaction.chartOfAccountsId.toString(),
            description: selectedTransaction.description,
            amount: selectedTransaction.amount.toString(),
          }}
          onClose={() => {
            setIsOpenEditTransactionModal(false);
            setSelectedTransaction(null);
          }}
          onSuccess={() => {
            setIsOpenEditTransactionModal(false);
            setSelectedTransaction(null);
            refetch();
          }}
        />
      )}
    </>
  );
};
