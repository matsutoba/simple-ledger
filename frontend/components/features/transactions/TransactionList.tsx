import { Card } from '@/components/ui/Card';
import { cn } from '@/components/shadcn/ui/utils';
import { BlockStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { ChartOfAccountsType, Transaction } from '@/types/transaction';
import { TRANSACTION_TYPE_COLORS } from '@/constants';
import { TransactionTypeIcon } from '../common/TransactionTypeIcon';
import { IconButton } from '@/components/ui/IconButton';
import { isExpenseType } from '@/lib/utils/accountType';

interface TransactionListProps {
  transactions: Transaction[];
}

const HEADER_CELL_STYLE =
  'border-b border-gray-400 text-gray-700 font-medium px-4 py-2 text-left';
const BODY_CELL_STYLE = 'border-b border-gray-200 px-4 py-2';

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
}) => {
  const getTransactionColor = (type: ChartOfAccountsType) =>
    TRANSACTION_TYPE_COLORS[isExpenseType(type) ? 'expense' : 'income'];

  return (
    <Card>
      <BlockStack gap="md">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className={HEADER_CELL_STYLE}>日付</th>
                <th className={HEADER_CELL_STYLE}>カテゴリ</th>
                <th className={HEADER_CELL_STYLE}>説明</th>
                <th className={HEADER_CELL_STYLE} align="right">
                  金額
                </th>
                <th className={HEADER_CELL_STYLE}>操作</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr
                  key={tx.id}
                  className={cn(
                    'hover:bg-gray-50',
                    index === 0 && 'border-t border-gray-200',
                  )}
                >
                  <td className={BODY_CELL_STYLE}>
                    <Typography className="text-sm text-gray-500">
                      {new Date(tx.date).toLocaleDateString()}
                    </Typography>
                  </td>
                  <td className={BODY_CELL_STYLE}>
                    <TransactionTypeIcon type={tx.chartOfAccountsType} />
                  </td>

                  <td className={BODY_CELL_STYLE}>
                    <Typography>{tx.description}</Typography>
                  </td>

                  <td className={BODY_CELL_STYLE}>
                    <Typography
                      className={getTransactionColor(tx.chartOfAccountsType)}
                      align="right"
                    >
                      {isExpenseType(tx.chartOfAccountsType) ? '-' : '+'}
                      {tx.amount.toLocaleString()} 円
                    </Typography>
                  </td>
                  <td className={BODY_CELL_STYLE}>
                    <IconButton
                      icon="trash"
                      size="md"
                      color="warning"
                      variant="ghost"
                      ariaLabel="Delete transaction"
                      className="cursor-pointer"
                    />
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
