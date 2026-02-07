import { Card } from '@/components/ui/Card';
import { cn } from '@/components/shadcn/ui/utils';
import { BlockStack, InlineStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Transaction } from '@/types/transaction';
import { IconButton } from '@/components/ui/IconButton';
import { CorrectionBadge } from './CorrectionBadge';

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
  const isCorrectionTransaction = (description: string): boolean => {
    return description.includes('【訂正】');
  };

  const getDebitEntry = (tx: Transaction) => {
    return tx.journalEntries?.find((entry) => entry.type === 'debit');
  };

  const getCreditEntry = (tx: Transaction) => {
    return tx.journalEntries?.find((entry) => entry.type === 'credit');
  };

  return (
    <Card>
      <BlockStack gap="md">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className={HEADER_CELL_STYLE}>取引日</th>
                <th className={HEADER_CELL_STYLE}>借方</th>
                <th className={HEADER_CELL_STYLE}>貸方</th>
                <th className={HEADER_CELL_STYLE}>説明</th>
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
                transactions.map((tx) => {
                  const debitEntry = getDebitEntry(tx);
                  const creditEntry = getCreditEntry(tx);

                  return (
                    <tr
                      key={tx.id}
                      className={cn(
                        'hover:bg-gray-50',
                        isCorrectionTransaction(tx.description) &&
                          'bg-yellow-50',
                      )}
                    >
                      <td className={BODY_CELL_STYLE}>
                        <Typography className="text-sm text-gray-500">
                          {new Date(tx.date).toLocaleDateString()}
                        </Typography>
                      </td>

                      <td className={BODY_CELL_STYLE}>
                        {debitEntry ? (
                          <BlockStack gap="xs">
                            <Typography className="text-sm font-medium">
                              {debitEntry.chartOfAccounts?.name}
                            </Typography>
                            <Typography
                              className="text-sm text-blue-600 font-medium"
                              align="right"
                            >
                              ¥{debitEntry.amount.toLocaleString()}
                            </Typography>
                          </BlockStack>
                        ) : (
                          <Typography className="text-sm text-gray-400">
                            -
                          </Typography>
                        )}
                      </td>

                      <td className={BODY_CELL_STYLE}>
                        {creditEntry ? (
                          <BlockStack gap="xs">
                            <Typography className="text-sm font-medium">
                              {creditEntry.chartOfAccounts?.name}
                            </Typography>
                            <Typography
                              className="text-sm text-red-600 font-medium"
                              align="right"
                            >
                              ¥{creditEntry.amount.toLocaleString()}
                            </Typography>
                          </BlockStack>
                        ) : (
                          <Typography className="text-sm text-gray-400">
                            -
                          </Typography>
                        )}
                      </td>

                      <td className={BODY_CELL_STYLE}>
                        <InlineStack alignItems="center" gap="sm">
                          <CorrectionBadge
                            showBadge={isCorrectionTransaction(tx.description)}
                          />
                          <Typography className="text-sm">
                            {tx.description}
                          </Typography>
                        </InlineStack>
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
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </BlockStack>
    </Card>
  );
};
