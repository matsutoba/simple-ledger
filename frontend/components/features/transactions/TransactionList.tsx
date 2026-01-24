import { Card } from '@/components/ui/Card';
import { cn } from '@/components/shadcn/ui/utils';
import { BlockStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { ChartOfAccountsType, Transaction } from '@/types/transaction';
import { TRANSACTION_TYPE_COLORS } from '@/constants';
import { IconButton } from '@/components/ui/IconButton';
import { isExpenseType } from '@/lib/utils/accountType';

interface TransactionListProps {
  transactions: Transaction[];
  onEditClick: (transaction: Transaction) => void;
}

const HEADER_CELL_STYLE =
  'border-b border-gray-400 text-gray-700 font-medium px-4 py-2 text-left';
const BODY_CELL_STYLE = 'border-b border-gray-200 px-4 py-2';

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onEditClick,
}) => {
  const getTransactionColor = (type: ChartOfAccountsType) =>
    TRANSACTION_TYPE_COLORS[isExpenseType(type) ? 'expense' : 'income'];

  const isCorrectionTransaction = (description: string): boolean => {
    return description.includes('【訂正】');
  };

  return (
    <Card>
      <BlockStack gap="md">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className={HEADER_CELL_STYLE}>日付</th>
                <th className={HEADER_CELL_STYLE}>勘定科目</th>
                <th className={HEADER_CELL_STYLE}>説明</th>
                <th className={HEADER_CELL_STYLE} align="right">
                  金額
                </th>
                <th className={HEADER_CELL_STYLE}>操作</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <Typography className="text-gray-500">
                      取引がありません
                    </Typography>
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className={cn(
                      'hover:bg-gray-50',
                      isCorrectionTransaction(tx.description) &&
                        'bg-yellow-50 border-l-4 border-yellow-400',
                    )}
                  >
                    <td className={BODY_CELL_STYLE}>
                      <Typography className="text-sm text-gray-500">
                        {new Date(tx.date).toLocaleDateString()}
                      </Typography>
                    </td>
                    <td className={BODY_CELL_STYLE}>
                      <div className="flex items-center gap-2">
                        <Typography className="text-sm font-medium">
                          {tx.chartOfAccountsName}
                        </Typography>
                      </div>
                    </td>

                    <td className={BODY_CELL_STYLE}>
                      <div className="flex items-center gap-2">
                        {isCorrectionTransaction(tx.description) && (
                          <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded font-medium whitespace-nowrap">
                            訂正
                          </span>
                        )}
                        <Typography>{tx.description}</Typography>
                      </div>
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
                        icon="edit"
                        size="md"
                        color="warning"
                        variant="ghost"
                        ariaLabel="Edit transaction"
                        className="cursor-pointer"
                        onClick={() => onEditClick(tx)}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </BlockStack>
    </Card>
  );
};
