import { Badge } from '@/components/shadcn/ui/badge';
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_BG_COLORS,
  TRANSACTION_TYPE_COLORS,
} from '@/constants';
import { isIncomeType } from '@/lib/utils/accountType';
import { ChartOfAccountsType } from '@/types/transaction';

interface TransactionTypeIconProps {
  type: ChartOfAccountsType;
}

export const TransactionTypeIcon: React.FC<TransactionTypeIconProps> = ({
  type,
}) => {
  const transactionType = isIncomeType(type) ? 'income' : 'expense';
  const color = `${TRANSACTION_TYPE_COLORS[transactionType]} ${TRANSACTION_TYPE_BG_COLORS[transactionType]}`;

  return (
    <Badge className={color}>{TRANSACTION_TYPE_LABELS[transactionType]}</Badge>
  );
};
