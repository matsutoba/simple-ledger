import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { InlineStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import type { IconName } from '@/components/ui/Icon';
import {
  TRANSACTION_TYPE_BG_COLORS,
  TRANSACTION_TYPE_COLORS,
} from '@/constants';
import { TrendType } from '@/types/transaction';

interface TrendCardProps {
  type: TrendType;
  amount: number;
}

export const TrendCard: React.FC<TrendCardProps> = ({ type, amount }) => {
  const title = {
    income: '総収入',
    expense: '総支出',
    balance: '収支',
  };

  const color = {
    income: TRANSACTION_TYPE_COLORS.income,
    expense: TRANSACTION_TYPE_COLORS.expense,
    balance: TRANSACTION_TYPE_COLORS.balance,
  };

  const iconBgColor = {
    income: TRANSACTION_TYPE_BG_COLORS.income,
    expense: TRANSACTION_TYPE_BG_COLORS.expense,
    balance: TRANSACTION_TYPE_BG_COLORS.balance,
  };

  const icon: { [key: string]: IconName } = {
    income: 'trending-up',
    expense: 'trending-down',
    balance: 'wallet',
  };

  return (
    <Card padding="lg">
      <InlineStack justifyContent="space-between" alignItems="center">
        <Typography>{title[type]}</Typography>
        <Icon name={icon[type]} className={`size-6 ${color[type]}`} />
      </InlineStack>
      <Typography variant="large" className="mt-2">
        {Number(amount).toLocaleString()} 円
      </Typography>
    </Card>
  );
};
