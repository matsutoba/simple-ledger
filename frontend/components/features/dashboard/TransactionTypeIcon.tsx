import { Badge } from '@/components/shadcn/ui/badge';
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_BG_COLORS,
  TRANSACTION_TYPE_COLORS,
} from '@/constants';
import { TransactionType } from '@/types/transaction';

interface TransactionTypeIconProps {
  type: TransactionType;
}

export const TransactionTypeIcon: React.FC<TransactionTypeIconProps> = ({
  type,
}) => {
  const color = `${TRANSACTION_TYPE_COLORS[type]} ${TRANSACTION_TYPE_BG_COLORS[type]}`;

  return <Badge className={color}>{TRANSACTION_TYPE_LABELS[type]}</Badge>;
};
