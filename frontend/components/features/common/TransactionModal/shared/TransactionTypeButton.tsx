'use client';

import { Button } from '@/components/ui/Button';
import {
  TRANSACTION_TYPE_BG_COLORS,
  TRANSACTION_TYPE_COLORS,
} from '@/constants/transaction';
import { TransactionType } from '@/types/transaction';

interface TransactionTypeButtonProps {
  type: TransactionType;
  selected: boolean;
  onClick: (transactionType: TransactionType) => void;
  disabled?: boolean;
}

export const TransactionTypeButton: React.FC<TransactionTypeButtonProps> = ({
  type,
  selected,
  onClick,
  disabled = false,
}) => {
  const defaultClassName =
    'border-gray-300 text-gray-700 hover:border-gray-400';
  const transactionClassName =
    type === 'income'
      ? `border-green-500 ${TRANSACTION_TYPE_BG_COLORS.income} ${TRANSACTION_TYPE_COLORS.income}`
      : `border-red-500 ${TRANSACTION_TYPE_BG_COLORS.expense} ${TRANSACTION_TYPE_COLORS.expense}`;
  const className = selected ? transactionClassName : defaultClassName;

  const label = type === 'income' ? '収入' : '支出';

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => {
        onClick(type);
      }}
      disabled={disabled}
      className={`px-4 py-3 rounded-lg border-2 transition-colors ${className}`}
    >
      {label}
    </Button>
  );
};
