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

const trendCardConfig: Record<
  TrendType,
  {
    title: string;
    icon: IconName;
    color: string;
    background: string;
  }
> = {
  income: {
    title: '総収入',
    icon: 'trending-up',
    color: TRANSACTION_TYPE_COLORS.income,
    background: TRANSACTION_TYPE_BG_COLORS.income,
  },
  expense: {
    title: '総支出',
    icon: 'trending-down',
    color: TRANSACTION_TYPE_COLORS.expense,
    background: TRANSACTION_TYPE_BG_COLORS.expense,
  },
  balance: {
    title: '収支',
    icon: 'wallet',
    color: TRANSACTION_TYPE_COLORS.balance,
    background: TRANSACTION_TYPE_BG_COLORS.balance,
  },
};

interface TrendCardProps {
  type: TrendType;
  amount: number;
}

export const TrendCard: React.FC<TrendCardProps> = ({ type, amount }) => {
  const config = trendCardConfig[type];

  return (
    <Card padding="lg">
      <InlineStack justifyContent="space-between" alignItems="center">
        <Typography variant="large">{config.title}</Typography>
        <div className={`p-2 rounded-md ${config.background}`}>
          <Icon name={config.icon} className={`size-6 ${config.color}`} />
        </div>
      </InlineStack>
      <Typography variant="xl" className="mt-2" bold>
        {Number(amount).toLocaleString()} 円
      </Typography>
    </Card>
  );
};
