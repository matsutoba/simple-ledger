'use client';

import { useCreateTransaction } from '@/hooks/useTransactions';
import { showSuccessToast, showErrorToast } from '@/components/ui/Toast';
import { TransactionModal } from './shared/TransactionModal';
import { z } from 'zod';
import { transactionSchema } from './shared/transaction_schema';

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

  type TransactionFormData = z.infer<typeof transactionSchema>;

  const handleSubmit = (formData: TransactionFormData) => {
    mutate(
      {
        date: formData.date,
        description: formData.description,
        journalEntries: formData.journalEntries,
      },
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
