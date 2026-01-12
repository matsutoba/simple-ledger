import { Card } from '@/components/ui/Card';
import { InlineStack } from '@/components/ui/Stack';
import { TextField } from '@/components/ui/TextField';
import { Select } from '@/components/ui/Select';
import { Icon } from '@/components/ui/Icon';
import { formControlColors } from '@/theme/colors';
import { TransactionFilterCategory } from '@/types/transaction';

interface TransactionFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  categoryValue: TransactionFilterCategory;
  onCategoryChange: (value: TransactionFilterCategory) => void;
}

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'すべて' },
  { value: 'income', label: '収入' },
  { value: 'expense', label: '支出' },
];

export const TransactionFilterBar: React.FC<TransactionFilterBarProps> = ({
  searchValue = '',
  onSearchChange,
  categoryValue = '',
  onCategoryChange,
}) => {
  return (
    <Card>
      <InlineStack gap="md" className="w-full">
        <div className="flex-1">
          <TextField
            icon="search"
            placeholder="取引を検索..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <InlineStack gap="sm" alignItems="center">
            <Icon name="funnel" size={20} className={formControlColors.icon} />
            <Select
              placeholder="カテゴリを選択"
              options={CATEGORY_OPTIONS}
              value={categoryValue}
              onValueChange={onCategoryChange}
            />
          </InlineStack>
        </div>
      </InlineStack>
    </Card>
  );
};
