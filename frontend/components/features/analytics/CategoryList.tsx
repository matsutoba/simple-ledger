'use client';

import {
  TransactionCategoryDataItem,
  TransactionType,
} from '@/types/transaction';
import { Card } from '@/components/ui/Card';
import {
  TRANSACTION_GRAPH_COLORS,
  TRANSACTION_TYPE_COLORS,
} from '@/constants/transaction';
import { Typography } from '@/components/ui/Typography';
import { formControlColors } from '@/theme/colors';
import { BlockStack, InlineStack } from '@/components/ui/Stack';

interface CategoryListProps {
  type: TransactionType;
  title: string;
  data: TransactionCategoryDataItem[];
}

export const CategoryList: React.FC<CategoryListProps> = ({
  type,
  title,
  data,
}) => {
  const textColor =
    type === 'income'
      ? TRANSACTION_TYPE_COLORS.income
      : TRANSACTION_TYPE_COLORS.expense;

  return (
    <Card>
      <BlockStack gap="md">
        <Typography>{title}</Typography>
        <hr className={formControlColors.border} />

        <BlockStack gap="sm">
          {data.map((item, index) => (
            <InlineStack key={index} justifyContent="space-between">
              <InlineStack gap="sm">
                <div
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor:
                      TRANSACTION_GRAPH_COLORS[
                        index % TRANSACTION_GRAPH_COLORS.length
                      ],
                  }}
                />
                <Typography>{item.name}</Typography>
              </InlineStack>
              <Typography className={textColor}>
                {item.value.toLocaleString()}円
              </Typography>
            </InlineStack>
          ))}
        </BlockStack>

        {data.length === 0 && (
          <InlineStack justifyContent="center" className="p-8">
            <Typography>データがありません</Typography>
          </InlineStack>
        )}
      </BlockStack>
    </Card>
  );
};
