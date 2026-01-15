'use client';

import { TransactionCategoryDataItem } from '@/types/transaction';
import { useMemo } from 'react';
import { Card } from '@/components/ui/Card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { BALANCE_CHART_HEX_COLORS } from '@/constants/transaction';
import { Typography } from '@/components/ui/Typography';
import { BlockStack, InlineStack } from '@/components/ui/Stack';

interface ExpenseTop5BarChartProps {
  data: TransactionCategoryDataItem[];
}

export const ExpenseTop5BarChart: React.FC<ExpenseTop5BarChartProps> = ({
  data,
}) => {
  const topExpenses = useMemo(() => {
    return data.sort((a, b) => b.value - a.value).slice(0, 5);
  }, [data]);

  console.log('topExpenses:', topExpenses);

  return (
    <Card>
      <BlockStack gap="lg">
        <Typography>支出の多いカテゴリTOP5</Typography>

        {/* 支出トップ5棒グラフ */}
        {topExpenses.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={topExpenses}
              margin={{ left: 100, right: 30 }}
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="value" />
              <YAxis type="category" dataKey="name" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white p-2 border border-gray-300 rounded">
                        <Typography variant="small">
                          {Number(payload[0].value).toLocaleString()}円
                        </Typography>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                fill={BALANCE_CHART_HEX_COLORS.expense}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <InlineStack justifyContent="center" className="p-8">
            <Typography>データがありません</Typography>
          </InlineStack>
        )}
      </BlockStack>
    </Card>
  );
};
