'use client';

import { TransactionType } from '@/types/transaction';
import { useCreateTransaction } from '@/hooks/useTransactions';
import { showSuccessToast, showErrorToast } from '@/components/ui/Toast';
import { TransactionModal } from './shared/TransactionModal';

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const { mutate, isPending } = useCreateTransaction();

  const handleSubmit = (formData: {
    type: TransactionType;
    date: string;
    category: string;
    description: string;
    amount: string;
  }) => {
    mutate(
      {
        date: formData.date,
        chartOfAccountsId: parseInt(formData.category, 10),
        amount: parseInt(formData.amount, 10),
        description: formData.description,
      } as const satisfies Parameters<typeof mutate>[0],
      {
        onSuccess: () => {
          showSuccessToast('取引を保存しました');
          onSuccess();
        },
        onError: (error: unknown) => {
          const errorMessage =
            error instanceof Error ? error.message : '取引の作成に失敗しました';
          showErrorToast(errorMessage);
        },
      },
    );
  };

  return (
    <TransactionModal
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
      mode="create"
      onSubmit={handleSubmit}
      isPending={isPending}
    />
  );
};
