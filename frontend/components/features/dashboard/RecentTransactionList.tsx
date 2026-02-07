import { Card } from '@/components/ui/Card';
import { cn } from '@/components/shadcn/ui/utils';
import { BlockStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Transaction } from '@/types/transaction';
import { useMemo } from 'react';

interface RecentTransactionListProps {
  transactions: Transaction[];
}

export const RecentTransactionList: React.FC<RecentTransactionListProps> = ({
  transactions,
}) => {
  const recentTransactions = useMemo(() => {
    return [...transactions].slice(0, 5);
  }, [transactions]);

  return (
    <Card>
      <BlockStack gap="md">
        <Typography>最近の取引</Typography>
        <div className="w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-gray-50">
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  日付
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  借方
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  貸方
                </th>
                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">
                  適用
                </th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx, index) => {
                const debitEntries =
                  tx.journalEntries?.filter(
                    (entry) => entry.type === 'debit',
                  ) || [];
                const creditEntries =
                  tx.journalEntries?.filter(
                    (entry) => entry.type === 'credit',
                  ) || [];

                return tx.journalEntries && tx.journalEntries.length > 0 ? (
                  Array.from({
                    length: Math.max(debitEntries.length, creditEntries.length),
                  }).map((_, i) => (
                    <tr
                      key={`${tx.id}-${i}`}
                      className={cn(
                        'border-b border-gray-200 hover:bg-gray-50',
                        i === 0 && index === 0 && 'border-t border-gray-200',
                      )}
                    >
                      {/* 日付 */}
                      <td className="px-4 py-2 text-sm text-gray-500">
                        {i === 0 && new Date(tx.date).toLocaleDateString()}
                      </td>

                      {/* 借方 */}
                      <td className="px-4 py-2 text-sm">
                        {debitEntries[i] && (
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <Typography className="text-gray-700 break-words">
                              {debitEntries[i].chartOfAccounts.name}
                            </Typography>
                            <Typography className="text-gray-600 font-medium whitespace-nowrap">
                              {debitEntries[i].amount.toLocaleString()}
                            </Typography>
                          </div>
                        )}
                      </td>

                      {/* 貸方 */}
                      <td className="px-4 py-2 text-sm">
                        {creditEntries[i] && (
                          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-2">
                            <Typography className="text-gray-700 break-words">
                              {creditEntries[i].chartOfAccounts.name}
                            </Typography>
                            <Typography className="text-gray-600 font-medium whitespace-nowrap">
                              {creditEntries[i].amount.toLocaleString()}
                            </Typography>
                          </div>
                        )}
                      </td>

                      {/* 適用 */}
                      <td className="px-4 py-2 text-xs text-gray-700">
                        {i === 0 && (
                          <Typography className="text-xs">
                            {tx.description}
                          </Typography>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr
                    key={tx.id}
                    className={cn(
                      'border-b border-gray-200 hover:bg-gray-50',
                      index === 0 && 'border-t border-gray-200',
                    )}
                  >
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td colSpan={2} className="px-4 py-2 text-sm text-gray-500">
                      仕訳エントリーなし
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <Typography>{tx.description}</Typography>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </BlockStack>
    </Card>
  );
};
