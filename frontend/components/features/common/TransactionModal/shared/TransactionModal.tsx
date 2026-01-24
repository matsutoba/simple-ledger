'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useState, Suspense } from 'react';
import { TextField } from '@/components/ui/TextField';
import { Typography } from '@/components/ui/Typography';
import { BlockStack, InlineStack } from '@/components/ui/Stack';
import { z } from 'zod';
import { transactionSchema } from './transaction_schema';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Spinner } from '@/components/ui/Spinner';
import { TransactionType } from '@/types/journalEntry';
import { Card } from '@/components/ui/Card';

type TransactionFormData = z.infer<typeof transactionSchema>;

interface JournalEntryInput {
  chartOfAccountsId: string;
  type: TransactionType;
  amount: string;
  description: string;
}

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
  onSubmit: (formData: TransactionFormData) => void;
  isPending: boolean;
  initialData?: TransactionFormData;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  open,
  onClose,
  onSuccess,
  mode,
  onSubmit,
  isPending,
  initialData,
}) => {
  const isEdit = mode === 'edit';
  const defaultDate =
    initialData?.date || new Date().toISOString().split('T')[0];
  const defaultEntries: JournalEntryInput[] = initialData?.journalEntries?.map(
    (e) => ({
      chartOfAccountsId: String(e.chartOfAccountsId),
      type: e.type,
      amount: String(e.amount),
      description: e.description || '',
    }),
  ) || [
    { chartOfAccountsId: '', type: 'debit', amount: '', description: '' },
    { chartOfAccountsId: '', type: 'credit', amount: '', description: '' },
  ];

  const [date, setDate] = useState(defaultDate);
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [entries, setEntries] = useState<JournalEntryInput[]>(defaultEntries);
  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionFormData, string>>
  >({});

  const resetForm = () => {
    setDate(defaultDate);
    setDescription(initialData?.description || '');
    setEntries(defaultEntries);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEntryChange = (
    index: number,
    field: keyof JournalEntryInput,
    value: string,
  ) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    setEntries(newEntries);
    if (errors.journalEntries) {
      setErrors({ ...errors, journalEntries: undefined });
    }
  };

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      {
        chartOfAccountsId: '',
        type: 'debit',
        amount: '',
        description: '',
      },
    ]);
  };

  const handleRemoveEntry = (index: number) => {
    if (entries.length > 2) {
      const newEntries = entries.filter((_, i) => i !== index);
      setEntries(newEntries);
    }
  };

  const calculateDebitTotal = () =>
    entries
      .filter((e) => e.type === 'debit')
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const calculateCreditTotal = () =>
    entries
      .filter((e) => e.type === 'credit')
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const isBalanced = calculateDebitTotal() === calculateCreditTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const journalEntries = entries.map((e) => ({
      chartOfAccountsId: Number(e.chartOfAccountsId),
      type: e.type as TransactionType,
      amount: Number(e.amount),
      description: e.description,
    }));

    const result = transactionSchema.safeParse({
      date,
      description,
      journalEntries,
    });

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TransactionFormData, string>> =
        {};
      result.error.issues.forEach((error) => {
        const path = error.path[0] as keyof TransactionFormData;
        fieldErrors[path] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  const title = isEdit ? '取引を編集' : '取引を追加';
  const modalDescription = isEdit
    ? '取引の詳細を編集してください。'
    : '取引の詳細を入力してください。';
  const buttonLabel = isEdit ? '更新' : '保存';

  return (
    <Modal
      isOpen={open}
      size="large"
      onOpenChange={handleClose}
      title={title}
      description={modalDescription}
      footer={
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button onClick={handleClose} variant="outline">
            キャンセル
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !isBalanced}>
            {buttonLabel}
          </Button>
        </div>
      }
    >
      {isPending && (
        <Spinner fullscreen label={isEdit ? '更新中...' : '保存中...'} />
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="日付"
          type="date"
          id="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            if (errors.date) setErrors({ ...errors, date: undefined });
          }}
          errorMessage={errors.date}
          required
          iconPosition="end"
        />

        <TextField
          label="説明（取引全体の説明）"
          type="text"
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description)
              setErrors({ ...errors, description: undefined });
          }}
          placeholder="この取引について（任意、最大100文字）"
          errorMessage={errors.description}
          maxLength={100}
        />

        {/* 仕訳エントリーセクション */}
        <BlockStack gap="md" className="mt-6">
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="medium" className="font-semibold">
                仕訳エントリー
              </Typography>
              <span className="text-xs text-gray-500">
                借方: ¥{calculateDebitTotal().toLocaleString()} 貸方: ¥
                {calculateCreditTotal().toLocaleString()}
              </span>
            </div>

            {!isBalanced && entries.length >= 2 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2 mb-4 text-xs text-yellow-700">
                ⚠️ 借方合計と貸方合計が一致していません
              </div>
            )}

            {entries.map((entry, index) => (
              <Card key={index} className="mb-3 p-3 bg-gray-50">
                <BlockStack gap="sm">
                  <InlineStack
                    alignItems="center"
                    gap="sm"
                    justify="between"
                    className="mb-2"
                  >
                    <Typography className="font-medium text-sm">
                      エントリー {index + 1}
                    </Typography>
                    {entries.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEntry(index)}
                        className="text-red-500 hover:text-red-700 text-xs"
                      >
                        削除
                      </button>
                    )}
                  </InlineStack>

                  <div className="grid grid-cols-3 gap-2">
                    {/* 借方/貸方選択 */}
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        種別
                      </label>
                      <select
                        value={entry.type}
                        onChange={(e) =>
                          handleEntryChange(
                            index,
                            'type',
                            e.target.value as TransactionType,
                          )
                        }
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="debit">借方</option>
                        <option value="credit">貸方</option>
                      </select>
                    </div>

                    {/* 金額 */}
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        金額
                      </label>
                      <input
                        type="number"
                        value={entry.amount}
                        onChange={(e) =>
                          handleEntryChange(index, 'amount', e.target.value)
                        }
                        placeholder="0"
                        min="0"
                        step="1"
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* 勘定科目 */}
                    <div>
                      <label className="block text-xs font-medium mb-1">
                        勘定科目
                      </label>
                      <ErrorBoundary>
                        <Suspense
                          fallback={
                            <div className="w-full h-8 bg-gray-200 rounded animate-pulse" />
                          }
                        >
                          <select
                            value={entry.chartOfAccountsId}
                            onChange={(e) =>
                              handleEntryChange(
                                index,
                                'chartOfAccountsId',
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">選択...</option>
                          </select>
                        </Suspense>
                      </ErrorBoundary>
                    </div>
                  </div>

                  {/* エントリー説明 */}
                  <input
                    type="text"
                    value={entry.description}
                    onChange={(e) =>
                      handleEntryChange(index, 'description', e.target.value)
                    }
                    placeholder="このエントリーの説明（任意）"
                    maxLength={100}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </BlockStack>
              </Card>
            ))}

            {errors.journalEntries && (
              <div className="text-red-600 text-xs mt-2">
                {errors.journalEntries}
              </div>
            )}

            <Button
              onClick={handleAddEntry}
              variant="outline"
              className="w-full mt-3 text-sm"
            >
              + エントリーを追加
            </Button>
          </div>
        </BlockStack>
      </form>
    </Modal>
  );
};
