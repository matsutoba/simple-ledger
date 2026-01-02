import { Card } from '@/components/ui/Card';
import { BlockStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Transaction } from '@/types/transaction';
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

  const getTransactionColor = (type: 'income' | 'expense') =>
    TRANSACTION_TYPE_COLORS[type];

  return (
    <Card>
      <BlockStack gap="md">
        <Typography>最近の取引</Typography>
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className={`${HEADER_CELL_STYLE}`}>日付</th>
                <th className={`${HEADER_CELL_STYLE}`}>カテゴリ</th>
                <th className={`${HEADER_CELL_STYLE}`}>説明</th>
                <th className={`${HEADER_CELL_STYLE} text-right`}>金額</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className={BODY_CELL_STYLE}>
                    <Typography>
                      {new Date(tx.date).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className={BODY_CELL_STYLE}>
                    <TransactionTypeIcon type={tx.type} />
                  </td>
                  <td className={BODY_CELL_STYLE}>
                    <Typography>{tx.description}</Typography>
                  </td>
                  <td className={BODY_CELL_STYLE}>
                    <Typography
                      className={getTransactionColor(tx.type)}
                      align="right"
                    >
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
