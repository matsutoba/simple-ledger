import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { InlineStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import type { IconName } from '@/components/ui/Icon';
import { TRANSACTION_TYPE_COLORS } from '@/constants';

interface TrendCardProps {
  type: 'trending-up' | 'trending-down' | 'wallet';
  amount: number;
}

export const TrendCard: React.FC<TrendCardProps> = ({ type, amount }) => {
  const title = {
    'trending-up': '総収入',
    'trending-down': '総支出',
    wallet: '収支',
  };

  const color = {
    'trending-up': TRANSACTION_TYPE_COLORS.income,
    'trending-down': TRANSACTION_TYPE_COLORS.expense,
    wallet: TRANSACTION_TYPE_COLORS.balance,
  };

  const icon: { [key: string]: IconName } = {
    'trending-up': 'trending-up',
    'trending-down': 'trending-down',
    wallet: 'wallet',
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
