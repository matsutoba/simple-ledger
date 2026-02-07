'use client';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Modal } from '@/components/ui/Modal';
import { useState, Suspense } from 'react';
import { TextField } from '@/components/ui/TextField';
import { Typography } from '@/components/ui/Typography';
import { BlockStack } from '@/components/ui/Stack';
import { z } from 'zod';
import { transactionSchema } from './transaction_schema';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Spinner } from '@/components/ui/Spinner';
import { TransactionType } from '@/types/journalEntry';
import {
  DebitChartOfAccountsSelect,
  CreditChartOfAccountsSelect,
} from './ChartOfAccountsSelect';

type TransactionFormData = z.infer<typeof transactionSchema>;

interface JournalEntryPair {
  debit: {
    chartOfAccountsId: string;
    amount: string;
  };
  credit: {
    chartOfAccountsId: string;
    amount: string;
  };
  description: string;
}

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
  const defaultEntries: JournalEntryPair[] = initialData?.journalEntries
    ? Array.from({
        length: Math.max(
          initialData.journalEntries.filter((e) => e.type === 'debit').length,
          initialData.journalEntries.filter((e) => e.type === 'credit').length,
        ),
      }).map((_, i) => {
        const debitEntry = initialData.journalEntries?.filter(
          (e) => e.type === 'debit',
        )[i];
        const creditEntry = initialData.journalEntries?.filter(
          (e) => e.type === 'credit',
        )[i];
        return {
          debit: {
            chartOfAccountsId: debitEntry
              ? String(debitEntry.chartOfAccountsId)
              : '',
            amount: debitEntry ? String(debitEntry.amount) : '',
          },
          credit: {
            chartOfAccountsId: creditEntry
              ? String(creditEntry.chartOfAccountsId)
              : '',
            amount: creditEntry ? String(creditEntry.amount) : '',
          },
          description:
            debitEntry?.description || creditEntry?.description || '',
        };
      })
    : [
        {
          debit: { chartOfAccountsId: '', amount: '' },
          credit: { chartOfAccountsId: '', amount: '' },
          description: '',
        },
      ];

  const [date, setDate] = useState(defaultDate);
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [entries, setEntries] = useState<JournalEntryPair[]>(defaultEntries);
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
    field: 'debit' | 'credit',
    subField: 'chartOfAccountsId' | 'amount',
    value: string,
  ) => {
    const newEntries = [...entries];
    newEntries[index] = {
      ...newEntries[index],
      [field]: {
        ...newEntries[index][field],
        [subField]: value,
      },
    };
    setEntries(newEntries);
    if (errors.journalEntries) {
      setErrors({ ...errors, journalEntries: undefined });
    }
  };

  const handleDescriptionChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = { ...newEntries[index], description: value };
    setEntries(newEntries);
  };

  const handleAddEntry = () => {
    setEntries([
      ...entries,
      {
        debit: { chartOfAccountsId: '', amount: '' },
        credit: { chartOfAccountsId: '', amount: '' },
        description: '',
      },
    ]);
  };

  const handleRemoveEntry = (index: number) => {
    if (entries.length > 1) {
      const newEntries = entries.filter((_, i) => i !== index);
      setEntries(newEntries);
    }
  };

  const calculateDebitTotal = () =>
    entries.reduce((sum, e) => sum + (Number(e.debit.amount) || 0), 0);

  const calculateCreditTotal = () =>
    entries.reduce((sum, e) => sum + (Number(e.credit.amount) || 0), 0);

  const isBalanced = calculateDebitTotal() === calculateCreditTotal();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const journalEntries = entries.flatMap((pair) => {
      const result = [];
      if (pair.debit.chartOfAccountsId && pair.debit.amount) {
        result.push({
          chartOfAccountsId: Number(pair.debit.chartOfAccountsId),
          type: 'debit' as TransactionType,
          amount: Number(pair.debit.amount),
          description: pair.description,
        });
      }
      if (pair.credit.chartOfAccountsId && pair.credit.amount) {
        result.push({
          chartOfAccountsId: Number(pair.credit.chartOfAccountsId),
          type: 'credit' as TransactionType,
          amount: Number(pair.credit.amount),
          description: pair.description,
        });
      }
      return result;
    });

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

            {errors.journalEntries && (
              <div className="text-red-600 text-xs mt-2">
                {errors.journalEntries}
              </div>
            )}

            {!isBalanced && entries.length >= 1 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-2 mb-4 text-xs text-yellow-700">
                借方合計と貸方合計が一致していません
              </div>
            )}

            {/* テーブル形式 */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b-2 border-gray-300 bg-gray-50">
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                      借方勘定科目
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 w-24">
                      借方金額
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700">
                      貸方勘定科目
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 w-24">
                      貸方金額
                    </th>
                    <th className="px-2 py-2 text-left text-xs font-semibold text-gray-700 flex-1">
                      適用
                    </th>
                    <th className="px-2 py-2 text-center text-xs font-semibold text-gray-700 w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      {/* 借方勘定科目 */}
                      <td className="px-2 py-2">
                        <ErrorBoundary>
                          <Suspense
                            fallback={
                              <div className="w-full h-8 bg-gray-200 rounded animate-pulse" />
                            }
                          >
                            <DebitChartOfAccountsSelect
                              value={entry.debit.chartOfAccountsId}
                              onChange={(value) =>
                                handleEntryChange(
                                  index,
                                  'debit',
                                  'chartOfAccountsId',
                                  value,
                                )
                              }
                              side="debit"
                            />
                          </Suspense>
                        </ErrorBoundary>
                      </td>

                      {/* 借方金額 */}
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={entry.debit.amount}
                          onChange={(e) =>
                            handleEntryChange(
                              index,
                              'debit',
                              'amount',
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          min="0"
                          step="1"
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      {/* 貸方勘定科目 */}
                      <td className="px-2 py-2">
                        <ErrorBoundary>
                          <Suspense
                            fallback={
                              <div className="w-full h-8 bg-gray-200 rounded animate-pulse" />
                            }
                          >
                            <CreditChartOfAccountsSelect
                              value={entry.credit.chartOfAccountsId}
                              onChange={(value) =>
                                handleEntryChange(
                                  index,
                                  'credit',
                                  'chartOfAccountsId',
                                  value,
                                )
                              }
                              side="credit"
                            />
                          </Suspense>
                        </ErrorBoundary>
                      </td>

                      {/* 貸方金額 */}
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          value={entry.credit.amount}
                          onChange={(e) =>
                            handleEntryChange(
                              index,
                              'credit',
                              'amount',
                              e.target.value,
                            )
                          }
                          placeholder="0"
                          min="0"
                          step="1"
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      {/* 適用（説明） */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={entry.description}
                          onChange={(e) =>
                            handleDescriptionChange(index, e.target.value)
                          }
                          placeholder="説明（任意）"
                          maxLength={100}
                          className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </td>

                      {/* 削除ボタン */}
                      <td className="px-2 py-2 text-center">
                        {entries.length > 1 && (
                          <IconButton
                            icon="trash"
                            onClick={() => handleRemoveEntry(index)}
                            title="削除"
                            size="sm"
                            color="secondary"
                            variant="ghost"
                            type="button"
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-start">
                <IconButton
                  icon="circle-plus"
                  onClick={handleAddEntry}
                  title="エントリーを追加"
                  size="sm"
                  color="secondary"
                  variant="ghost"
                  type="button"
                />
              </div>
            </div>
          </div>
        </BlockStack>
      </form>
    </Modal>
  );
};
