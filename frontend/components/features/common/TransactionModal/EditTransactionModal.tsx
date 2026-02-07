'use client';

import { useUpdateTransaction } from '@/hooks/useTransactions';
import { showSuccessToast, showErrorToast } from '@/components/ui/Toast';
import { TransactionModal } from './shared/TransactionModal';
import { z } from 'zod';
import { transactionSchema } from './shared/transaction_schema';
import { Transaction } from '@/types/transaction';
import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

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
  const [showCorrectionDialog, setShowCorrectionDialog] = useState(false);
  const [correctionNote, setCorrectionNote] = useState('');
  const [pendingFormData, setPendingFormData] = useState<z.infer<
    typeof transactionSchema
  > | null>(null);

  type TransactionFormData = z.infer<typeof transactionSchema>;

  const handleSubmit = (formData: TransactionFormData) => {
    // 修正ダイアログを表示
    setPendingFormData(formData);
    setShowCorrectionDialog(true);
  };

  const handleConfirmCorrection = () => {
    if (!pendingFormData) return;

    mutate(
      {
        id: transactionId,
        request: {
          date: pendingFormData.date,
          description: pendingFormData.description,
          journalEntries: pendingFormData.journalEntries,
          ...(correctionNote && { correctionNote }),
        },
      },
      {
        onSuccess: () => {
          showSuccessToast('取引を更新しました');
          onSuccess();
          setShowCorrectionDialog(false);
          setCorrectionNote('');
          setPendingFormData(null);
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
    <>
      <TransactionModal
        open={open}
        onClose={onClose}
        onSuccess={onSuccess}
        mode="edit"
        onSubmit={handleSubmit}
        isPending={isPending}
        initialData={dataWithDefaults}
      />

      <Modal
        isOpen={showCorrectionDialog}
        onOpenChange={(open) => {
          if (!open) {
            setShowCorrectionDialog(false);
            setCorrectionNote('');
            setPendingFormData(null);
          }
        }}
        title="取引を修正しますか？"
        dismissible={true}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            この取引を修正として記録します。修正理由を入力してください。
          </p>
          <textarea
            value={correctionNote}
            onChange={(e) => setCorrectionNote(e.target.value)}
            placeholder="修正理由を入力（オプション）"
            className="w-full border rounded p-2 text-sm"
            rows={3}
            maxLength={255}
          />
          <div className="flex gap-2 justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowCorrectionDialog(false);
                setCorrectionNote('');
                setPendingFormData(null);
              }}
            >
              キャンセル
            </Button>
            <Button onClick={handleConfirmCorrection} disabled={isPending}>
              {isPending ? '保存中...' : '修正として保存'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
