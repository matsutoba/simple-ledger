'use client';

import { useUpdateTransaction } from '@/hooks/useTransactions';
import { showSuccessToast, showErrorToast } from '@/components/ui/Toast';
import { TransactionModal } from './shared/TransactionModal';
import { z } from 'zod';
import { transactionSchema } from './shared/transaction_schema';
import { Transaction } from '@/types/transaction';

interface EditTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transactionId: number;
  initialData: Transaction;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  open,
  onClose,
  onSuccess,
  transactionId,
  initialData,
}) => {
  const { mutate, isPending } = useUpdateTransaction();

  type TransactionFormData = z.infer<typeof transactionSchema>;

  const handleSubmit = (formData: TransactionFormData) => {
    mutate(
      {
        id: transactionId,
        request: {
          date: formData.date,
          description: formData.description,
          journalEntries: formData.journalEntries,
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

  // initialData の journalEntries が undefined の場合のデフォルト値を提供
  const dataWithDefaults = initialData
    ? {
        ...initialData,
        journalEntries: initialData.journalEntries || [
          {
            chartOfAccountsId: 1,
            type: 'debit' as const,
            amount: 0,
            description: '',
          },
          {
            chartOfAccountsId: 1,
            type: 'credit' as const,
            amount: 0,
            description: '',
          },
        ],
      }
    : undefined;

  return (
    <TransactionModal
      open={open}
      onClose={onClose}
      onSuccess={onSuccess}
      mode="edit"
      onSubmit={handleSubmit}
      isPending={isPending}
      initialData={dataWithDefaults}
    />
  );
};
