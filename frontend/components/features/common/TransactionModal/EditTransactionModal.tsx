'use client';

import { TransactionType } from '@/types/transaction';
import { useUpdateTransaction } from '@/hooks/useTransactions';
import { showSuccessToast, showErrorToast } from '@/components/ui/Toast';
import { TransactionModal } from './shared/TransactionModal';

interface EditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transactionId: number;
  initialData: {
    type: TransactionType;
    date: string;
    category: string;
    description: string;
    amount: string;
  };
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  open,
  onClose,
  onSuccess,
  transactionId,
  initialData,
}) => {
  const { mutate, isPending } = useUpdateTransaction();

  const handleSubmit = (formData: {
    type: TransactionType;
    date: string;
    category: string;
    description: string;
    amount: string;
  }) => {
    mutate(
      {
        id: transactionId,
        request: {
          date: formData.date,
          chartOfAccountsId: parseInt(formData.category, 10),
          amount: parseInt(formData.amount, 10),
          description: formData.description,
        },
      },
      {
        onSuccess: () => {
          showSuccessToast('取引を更新しました');
          onSuccess();
        },
        onError: (error: unknown) => {
          const errorMessage =
            error instanceof Error ? error.message : '取引の更新に失敗しました';
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
      mode="edit"
      onSubmit={handleSubmit}
      isPending={isPending}
      initialData={initialData}
    />
  );
};
