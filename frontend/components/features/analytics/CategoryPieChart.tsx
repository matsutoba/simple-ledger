'use client';

import { TransactionCategoryDataItem } from '@/types/transaction';
import { Card } from '@/components/ui/Card';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { TRANSACTION_GRAPH_COLORS } from '@/constants/transaction';
import { Typography } from '@/components/ui/Typography';
import { BlockStack, InlineStack } from '@/components/ui/Stack';

interface CategoryPieChartProps {
  title: string;
  data: TransactionCategoryDataItem[];
}

export const CategoryPieChart: React.FC<CategoryPieChartProps> = ({
  title,
  data,
}) => {
  return (
    <Card>
      <BlockStack gap="lg">
        <Typography>{title}</Typography>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      TRANSACTION_GRAPH_COLORS[
                        index % TRANSACTION_GRAPH_COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `¥${Number(value).toLocaleString()}`}
              />
            </PieChart>
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
