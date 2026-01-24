'use client';

import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TransactionType } from '@/types/transaction';
import { useState, Suspense } from 'react';
import { TransactionTypeButton } from './TransactionTypeButton';
import { TextField } from '@/components/ui/TextField';
import { Typography } from '@/components/ui/Typography';
import { BlockStack } from '@/components/ui/Stack';
import { z } from 'zod';
import { transactionSchema } from './transaction_schema';
import { SelectChartOfAccounts } from './SelectChartOfAccounts';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { Spinner } from '@/components/ui/Spinner';

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  mode: 'create' | 'edit';
  onSubmit: (formData: {
    type: TransactionType;
    date: string;
    category: string;
    description: string;
    amount: string;
  }) => void;
  isPending: boolean;
  initialData?: {
    type: TransactionType;
    date: string;
    category: string;
    description: string;
    amount: string;
  };
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
  const defaultType = initialData?.type || 'expense';
  const defaultDate =
    initialData?.date || new Date().toISOString().split('T')[0];

  const [type, setType] = useState<TransactionType>(defaultType);
  const [date, setDate] = useState(defaultDate);
  const [category, setCategory] = useState(initialData?.category || '');
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionFormData, string>>
  >({});

  const resetForm = () => {
    setType(defaultType);
    setDate(defaultDate);
    setCategory(initialData?.category || '');
    setDescription(initialData?.description || '');
    setAmount(initialData?.amount || '');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleTypeChange = (transactionType: TransactionType) => {
    setType(transactionType);
    setCategory('');
    if (errors.type) setErrors({ ...errors, type: undefined });
    if (errors.category)
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors.category;
        return newErrors;
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = transactionSchema.safeParse({
      type,
      date,
      category,
      description,
      amount,
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
    onSubmit({ type, date, category, description, amount });
  };

  const title = isEdit ? '取引を編集' : '取引を追加';
  const modalDescription = isEdit
    ? '取引の詳細を編集してください。'
    : '取引の詳細を入力してください。';
  const buttonLabel = isEdit ? '更新' : '保存';
  const successMessage = isEdit ? '取引を更新しました' : '取引を保存しました';

  return (
    <Modal
      isOpen={open}
      size="medium"
      onOpenChange={handleClose}
      title={title}
      description={modalDescription}
      footer={
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button onClick={handleClose} variant="outline">
            キャンセル
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {buttonLabel}
          </Button>
        </div>
      }
    >
      {isPending && (
        <Spinner fullscreen label={isEdit ? '更新中...' : '保存中...'} />
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <BlockStack gap="sm">
          <Typography variant="small">種別</Typography>
          <div className="grid grid-cols-2 gap-3">
            <TransactionTypeButton
              type="income"
              selected={type === 'income'}
              onClick={() => handleTypeChange('income')}
              disabled={isEdit}
            />
            <TransactionTypeButton
              type="expense"
              selected={type === 'expense'}
              onClick={() => handleTypeChange('expense')}
              disabled={isEdit}
            />
          </div>
        </BlockStack>

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

        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="space-y-1">
                <label className="block text-sm font-medium">勘定科目</label>
                <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            }
          >
            <SelectChartOfAccounts
              type={type}
              category={category}
              onCategoryChange={(value: string) => {
                setCategory(value);
                if (errors.category)
                  setErrors({ ...errors, category: undefined });
              }}
              errorMessage={errors.category}
            />
          </Suspense>
        </ErrorBoundary>

        <TextField
          label="説明"
          type="text"
          id="description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (errors.description)
              setErrors({ ...errors, description: undefined });
          }}
          placeholder="取引の詳細を入力（任意、最大100文字）"
          errorMessage={errors.description}
          maxLength={100}
        />

        <TextField
          label="金額"
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            if (errors.amount) setErrors({ ...errors, amount: undefined });
          }}
          placeholder="0"
          min="0"
          step="1"
          errorMessage={errors.amount}
          required
        />
      </form>
    </Modal>
  );
};
