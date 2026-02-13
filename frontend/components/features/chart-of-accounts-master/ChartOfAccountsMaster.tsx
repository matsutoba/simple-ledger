'use client';

import { Suspense } from 'react';
import { Typography } from '@/components/ui/Typography';
import { BlockStack, InlineStack } from '@/components/ui/Stack';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Spinner } from '@/components/ui/Spinner';
import { useAllChartOfAccounts } from '@/hooks/useChartOfAccounts';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AccountsList } from './AccountsList';
import type { ChartOfAccount } from '@/types/chartOfAccount';

const accountTypeLabels: Record<string, string> = {
  asset: '資産',
  liability: '負債',
  equity: '資本',
  revenue: '収益',
  expense: '費用',
};

// 区分ごとに重複なく勘定科目をグループ化
const groupAccountsByType = (
  accounts: ChartOfAccount[],
): Record<string, ChartOfAccount[]> => {
  const grouped: Record<string, ChartOfAccount[]> = {
    asset: [],
    liability: [],
    equity: [],
    revenue: [],
    expense: [],
  };

  accounts.forEach((account) => {
    if (grouped[account.type]) {
      grouped[account.type].push(account);
    }
  });

  return grouped;
};

// グループを表示順序でソート
const sortedGroupKeys = [
  'asset',
  'liability',
  'equity',
  'revenue',
  'expense',
] as const;

/**
 * Suspense内で実行されるコンポーネント
 * useAllChartOfAccounts (Suspense版) でデータを取得
 */
const ChartOfAccountsMasterContent: React.FC = () => {
  const { data: accounts } = useAllChartOfAccounts();
  const groupedAccounts = groupAccountsByType(accounts);

  return (
    <BlockStack gap="lg">
      {sortedGroupKeys.map((typeKey) => {
        const typeAccounts = groupedAccounts[typeKey];
        if (typeAccounts.length === 0) return null;

        return (
          <AccountsList
            key={typeKey}
            title={accountTypeLabels[typeKey]}
            accounts={typeAccounts}
          />
        );
      })}

      {accounts.length === 0 && (
        <div className="py-8 text-center">
          <Typography className="text-gray-500">
            勘定科目マスタにデータがありません
          </Typography>
        </div>
      )}
    </BlockStack>
  );
};

/**
 * Spinnerのフォールバック表示
 */
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center py-8">
    <Spinner />
  </div>
);

/**
 * エラーフォールバック表示
 */
const ErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <div className="bg-red-50 border border-red-200 rounded p-4">
    <Typography className="text-red-700">
      エラーが発生しました: {error.message}
    </Typography>
  </div>
);

export const ChartOfAccountsMaster: React.FC = () => {
  return (
    <BlockStack gap="lg">
      <InlineStack justifyContent="space-between" alignItems="center">
        <Typography variant="2xl">勘定科目マスタ</Typography>
        <Button>
          <Icon name="plus" />
          新規追加
        </Button>
      </InlineStack>

      <ErrorBoundary fallback={(error) => <ErrorFallback error={error} />}>
        <Suspense fallback={<LoadingFallback />}>
          <ChartOfAccountsMasterContent />
        </Suspense>
      </ErrorBoundary>
    </BlockStack>
  );
};
