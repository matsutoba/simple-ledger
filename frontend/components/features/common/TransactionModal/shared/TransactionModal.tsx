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
import { EntryType } from '@/types/journalEntry';
import { FlexibleChartOfAccountsSelect } from './FlexibleChartOfAccountsSelect';

type TransactionFormData = z.infer<typeof transactionSchema>;

interface JournalEntryInput {
  chartOfAccountsId: string;
  type: EntryType;
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
  mode,
  onSubmit,
  isPending,
  initialData,
}) => {
  const isEdit = mode === 'edit';
  const defaultDate =
    initialData?.date || new Date().toISOString().split('T')[0];

  // 初期データを新しい構造に変換
  const defaultEntries: JournalEntryInput[] = initialData?.journalEntries
    ? initialData.journalEntries.map((entry) => ({
        chartOfAccountsId: String(entry.chartOfAccountsId),
        type: entry.type,
        amount: String(entry.amount),
        description: entry.description,
      }))
    : [
        {
          chartOfAccountsId: '',
          type: 'debit',
          amount: '',
          description: '',
        },
        {
          chartOfAccountsId: '',
          type: 'credit',
          amount: '',
          description: '',
        },
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
      {
        chartOfAccountsId: '',
        type: 'credit',
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

    const journalEntries = entries
      .filter((entry) => entry.chartOfAccountsId && entry.amount)
      .map((entry) => ({
        chartOfAccountsId: Number(entry.chartOfAccountsId),
        type: entry.type as EntryType,
        amount: Number(entry.amount),
        description: entry.description,
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
                  {/* 借方・貸方を1行で表示、複数仕訳対応 */}
                  {(() => {
                    const debitEntries = entries
                      .map((e, i) =>
                        e.type === 'debit' ? { ...e, index: i } : null,
                      )
                      .filter((e) => e !== null);
                    const creditEntries = entries
                      .map((e, i) =>
                        e.type === 'credit' ? { ...e, index: i } : null,
                      )
                      .filter((e) => e !== null);
                    const rowCount = Math.max(
                      debitEntries.length || 1,
                      creditEntries.length || 1,
                    );

                    return Array.from({ length: rowCount }).map((_, row) => {
                      const debit = debitEntries[row];
                      const credit = creditEntries[row];

                      return (
                        <tr
                          key={`row-${row}`}
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
                                {debit ? (
                                  <FlexibleChartOfAccountsSelect
                                    value={debit.chartOfAccountsId}
                                    onChange={(value) =>
                                      handleEntryChange(
                                        debit.index,
                                        'chartOfAccountsId',
                                        value,
                                      )
                                    }
                                    type="debit"
                                  />
                                ) : (
                                  <select
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        // 借方エントリーを新規作成
                                        const newEntries = [...entries];
                                        const insertIndex = credit
                                          ? entries.indexOf(credit) - 1
                                          : entries.length;
                                        newEntries.splice(
                                          insertIndex >= 0 ? insertIndex : 0,
                                          0,
                                          {
                                            chartOfAccountsId: e.target.value,
                                            type: 'debit',
                                            amount: '',
                                            description: '',
                                          },
                                        );
                                        setEntries(newEntries);
                                      }
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">選択...</option>
                                  </select>
                                )}
                              </Suspense>
                            </ErrorBoundary>
                          </td>

                          {/* 借方金額 */}
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={debit?.amount || ''}
                              onChange={(e) => {
                                if (debit) {
                                  handleEntryChange(
                                    debit.index,
                                    'amount',
                                    e.target.value,
                                  );
                                } else if (e.target.value) {
                                  // 借方エントリーを新規作成
                                  const newEntries = [...entries];
                                  const insertIndex = credit
                                    ? entries.indexOf(credit)
                                    : 0;
                                  newEntries.splice(insertIndex, 0, {
                                    chartOfAccountsId: '',
                                    type: 'debit',
                                    amount: e.target.value,
                                    description: '',
                                  });
                                  setEntries(newEntries);
                                }
                              }}
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
                                {credit ? (
                                  <FlexibleChartOfAccountsSelect
                                    value={credit.chartOfAccountsId}
                                    onChange={(value) =>
                                      handleEntryChange(
                                        credit.index,
                                        'chartOfAccountsId',
                                        value,
                                      )
                                    }
                                    type="credit"
                                  />
                                ) : (
                                  <select
                                    value=""
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        // 貸方エントリーを新規作成
                                        const newEntries = [...entries];
                                        const insertIndex =
                                          debit !== undefined
                                            ? entries.indexOf(debit) + 1
                                            : entries.length;
                                        newEntries.splice(insertIndex, 0, {
                                          chartOfAccountsId: e.target.value,
                                          type: 'credit',
                                          amount: '',
                                          description: '',
                                        });
                                        setEntries(newEntries);
                                      }
                                    }}
                                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">選択...</option>
                                  </select>
                                )}
                              </Suspense>
                            </ErrorBoundary>
                          </td>

                          {/* 貸方金額 */}
                          <td className="px-2 py-2">
                            <input
                              type="number"
                              value={credit?.amount || ''}
                              onChange={(e) => {
                                if (credit) {
                                  handleEntryChange(
                                    credit.index,
                                    'amount',
                                    e.target.value,
                                  );
                                } else if (e.target.value) {
                                  // 貸方エントリーを新規作成
                                  const newEntries = [...entries];
                                  const insertIndex =
                                    debit !== undefined
                                      ? entries.indexOf(debit) + 1
                                      : entries.length;
                                  newEntries.splice(insertIndex, 0, {
                                    chartOfAccountsId: '',
                                    type: 'credit',
                                    amount: e.target.value,
                                    description: '',
                                  });
                                  setEntries(newEntries);
                                }
                              }}
                              placeholder="0"
                              min="0"
                              step="1"
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>

                          {/* 適用（説明）*/}
                          <td className="px-2 py-2">
                            <input
                              type="text"
                              value={
                                debit?.description || credit?.description || ''
                              }
                              onChange={(e) => {
                                if (debit) {
                                  handleEntryChange(
                                    debit.index,
                                    'description',
                                    e.target.value,
                                  );
                                } else if (credit) {
                                  handleEntryChange(
                                    credit.index,
                                    'description',
                                    e.target.value,
                                  );
                                }
                              }}
                              placeholder="説明（任意）"
                              maxLength={100}
                              className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </td>

                          {/* 削除ボタン */}
                          <td className="px-2 py-2 text-center">
                            {entries.length > 2 && (debit || credit) && (
                              <IconButton
                                icon="trash"
                                onClick={() => {
                                  // 借方と貸方のペアを同時に削除
                                  const debitIndex = debit?.index;
                                  const creditIndex = credit?.index;

                                  if (
                                    debitIndex !== undefined &&
                                    creditIndex !== undefined &&
                                    creditIndex !== debitIndex
                                  ) {
                                    // 両方削除（インデックスが異なる場合）
                                    const indicesToRemove = [
                                      debitIndex,
                                      creditIndex,
                                    ].sort((a, b) => b - a);
                                    let newEntries = [...entries];
                                    indicesToRemove.forEach((index) => {
                                      newEntries = newEntries.filter(
                                        (_, i) => i !== index,
                                      );
                                    });
                                    setEntries(newEntries);
                                  } else if (debitIndex !== undefined) {
                                    // 借方のみ削除
                                    handleRemoveEntry(debitIndex);
                                  } else if (creditIndex !== undefined) {
                                    // 貸方のみ削除
                                    handleRemoveEntry(creditIndex);
                                  }
                                }}
                                title="削除"
                                size="sm"
                                color="secondary"
                                variant="ghost"
                                type="button"
                              />
                            )}
                          </td>
                        </tr>
                      );
                    });
                  })()}
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
