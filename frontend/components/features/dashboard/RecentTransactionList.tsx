import { Card } from '@/components/ui/Card';
import { cn } from '@/components/shadcn/ui/utils';
import { BlockStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Transaction, TransactionType } from '@/types/transaction';
import { useMemo } from 'react';
import { TRANSACTION_TYPE_COLORS } from '@/constants';
import { TransactionTypeIcon } from './TransactionTypeIcon';

interface RecentTransactionListProps {
  transactions: Transaction[];
}

const HEADER_CELL_STYLE =
  'border-b border-gray-400 text-gray-700 font-medium px-4 py-2 text-left';
const BODY_CELL_STYLE = 'border-b border-gray-200 px-4 py-2';

export const RecentTransactionList: React.FC<RecentTransactionListProps> = ({
  transactions,
}) => {
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 5);
  }, [transactions]);

  const getTransactionColor = (type: TransactionType) =>
    TRANSACTION_TYPE_COLORS[type];

  return (
    <Card>
      <BlockStack gap="md">
        <Typography>最近の取引</Typography>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <tbody>
              {recentTransactions.map((tx, index) => (
                <tr
                  key={tx.id}
                  className={cn(
                    'hover:bg-gray-50',
                    index === 0 && 'border-t border-gray-200',
                  )}
                >
                  <td className={BODY_CELL_STYLE}>
                    <div className="flex items-center gap-2 mb-1">
                      <TransactionTypeIcon type={tx.type} />
                      <Typography>{tx.description}</Typography>
                    </div>
                    <Typography className="text-sm text-gray-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className={BODY_CELL_STYLE}>
                    <Typography
                      className={getTransactionColor(tx.type)}
                      align="right"
                    >
                      {tx.type === 'expense' ? '-' : '+'}
                      {tx.amount.toLocaleString()} 円
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </BlockStack>
    </Card>
  );
};
