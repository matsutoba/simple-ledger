import { Card } from '@/components/ui/Card';
import { InlineStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';

interface TrendCardProps {
  count: number;
}

export const CountCard: React.FC<TrendCardProps> = ({ count }) => {
  return (
    <Card padding="md">
      <InlineStack justifyContent="space-between" alignItems="center">
        <Typography variant="large">総取引数</Typography>
      </InlineStack>
      <Typography variant="xl" className="mt-2" bold>
        {Number(count).toLocaleString()} 件
      </Typography>
    </Card>
  );
};
