'use client';

import { TransactionType } from '@/types/transaction';
import { useCreateTransaction } from '@/hooks/useTransactions';
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

/**
 * 訂正仕訳を使用した取引修正
 * 簿記ルール上、元の取引は保持したまま訂正仕訳を作成する
 *
 * 実装方法：
 * 1. 逆仕訳：元の金額と反対の仕訳を作成
 * 2. 新規仕訳：正しい金額で新しい仕訳を作成
 *
 * 例）100円→80円に修正する場合
 * - 逆仕訳：-100円を追加
 * - 新規仕訳：+80円を追加
 * - 結果：取引は3件になり、合計は80円になる
 */
export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  open,
  onClose,
  onSuccess,
  transactionId,
  initialData,
}) => {
  const { mutate, isPending } = useCreateTransaction();

  const handleSubmit = (formData: {
    type: TransactionType;
    date: string;
    category: string;
    description: string;
    amount: string;
  }) => {
    const originalAmount = parseInt(initialData.amount, 10);
    const newAmount = parseInt(formData.amount, 10);

    // 逆仕訳を作成（元の金額を打ち消す）
    const reversal = {
      date: initialData.date,
      chartOfAccountsId: parseInt(initialData.category, 10),
      amount: originalAmount,
      description: `【訂正】元の取引（ID:${transactionId}）を訂正`,
    };

    // 新規仕訳を作成（正しい金額）
    const correctedTransaction = {
      date: formData.date,
      chartOfAccountsId: parseInt(formData.category, 10),
      amount: newAmount,
      description: `【訂正】${formData.description}`,
    };

    // 先に逆仕訳を作成、その後新規仕訳を作成
    mutate(reversal, {
      onSuccess: () => {
        // 逆仕訳成功後、新規仕訳を作成
        mutate(correctedTransaction, {
          onSuccess: () => {
            showSuccessToast(`取引を訂正しました（逆仕訳と新規仕訳を作成）`);
            onSuccess();
          },
          onError: (error: unknown) => {
            const errorMessage =
              error instanceof Error
                ? error.message
                : '訂正仕訳の作成に失敗しました';
            showErrorToast(errorMessage);
          },
        });
      },
      onError: (error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : '逆仕訳の作成に失敗しました';
        showErrorToast(errorMessage);
      },
    });
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
