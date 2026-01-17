import { Card } from '@/components/ui/Card';
import { BlockStack } from '@/components/ui/Stack';
import { Typography } from '@/components/ui/Typography';
import { Transaction } from '@/types/transaction';
import { TRANSACTION_TYPE_HEX_COLORS } from '@/constants';
import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { isIncomeType } from '@/lib/utils/accountType';

interface MonthlyBalanceChartProps {
  transactions: Transaction[];
}

interface ChartData {
  month: string;
  収入: number;
  支出: number;
  収支: number;
}

export const MonthlyBalanceChart: React.FC<MonthlyBalanceChartProps> = ({
  transactions,
}) => {
  const chartData: ChartData[] = useMemo(() => {
    const monthlyData: { [key: string]: { income: number; expense: number } } =
      {};

    transactions.forEach((t) => {
      const month = t.date.substring(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { income: 0, expense: 0 };
      }
      if (isIncomeType(t.chartOfAccountsType)) {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        収入: data.income,
        支出: data.expense,
        収支: data.income - data.expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }, [transactions]);

  return (
    <Card>
      <BlockStack gap="md">
        <Typography>月別収支推移</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ left: 50, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: ChartData) =>
                `¥${Number(value).toLocaleString()}`
              }
            />
            <Legend />
            <Bar dataKey="収入" fill={TRANSACTION_TYPE_HEX_COLORS.income} />
            <Bar dataKey="支出" fill={TRANSACTION_TYPE_HEX_COLORS.expense} />
          </BarChart>
        </ResponsiveContainer>
      </BlockStack>
    </Card>
  );
};
