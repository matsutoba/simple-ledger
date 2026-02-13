'use client';

import { Card } from '@/components/ui/Card';
import { BlockStack, InlineStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { IconButton } from '@/components/ui/IconButton';
import { ChartOfAccount } from '@/types/chartOfAccount';

interface AccountsListProps {
  title: string;
  accounts: ChartOfAccount[];
}

const HEADER_CELL_STYLE =
  'border-b border-gray-400 text-gray-700 font-medium px-4 py-2 text-left';
const BODY_CELL_STYLE = 'border-b border-gray-200 px-4 py-2';

const accountTypeLabels: Record<string, string> = {
  asset: '資産',
  liability: '負債',
  equity: '資本',
  revenue: '収益',
  expense: '費用',
};

const normalBalanceLabels: Record<string, string> = {
  debit: '借方',
  credit: '貸方',
};

export const AccountsList: React.FC<AccountsListProps> = ({
  title,
  accounts,
}) => {
  return (
    <Card>
      <BlockStack gap="md">
        <Typography variant="h4" className="font-semibold">
          {title}
        </Typography>

        {accounts.length === 0 && (
          <div className="py-8 text-center">
            <Typography className="text-gray-500">
              該当する勘定科目がありません
            </Typography>
          </div>
        )}

        {accounts.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className={HEADER_CELL_STYLE}>コード</th>
                  <th className={HEADER_CELL_STYLE}>勘定科目</th>
                  <th className={HEADER_CELL_STYLE}>借方/貸方</th>
                  <th className={HEADER_CELL_STYLE}>説明</th>
                  <th className={HEADER_CELL_STYLE}>操作</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td className={BODY_CELL_STYLE}>
                      <Typography>{account.code}</Typography>
                    </td>
                    <td className={BODY_CELL_STYLE}>
                      <Typography>{account.name}</Typography>
                    </td>
                    <td className={BODY_CELL_STYLE}>
                      <Typography>
                        {normalBalanceLabels[account.normalBalance] ||
                          account.normalBalance}
                      </Typography>
                    </td>
                    <td className={BODY_CELL_STYLE}>
                      <Typography className="truncate">
                        {account.description || '-'}
                      </Typography>
                    </td>
                    <td className={BODY_CELL_STYLE}>
                      <InlineStack gap="xs">
                        <IconButton
                          icon="edit"
                          size="sm"
                          color="warning"
                          variant="ghost"
                          ariaLabel="Edit account"
                          className="cursor-pointer"
                          onClick={() => {}}
                        />
                        <IconButton
                          icon="trash"
                          size="sm"
                          color="warning"
                          variant="ghost"
                          ariaLabel="Edit account"
                          className="cursor-pointer"
                          onClick={() => {}}
                        />
                      </InlineStack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </BlockStack>
    </Card>
  );
};
