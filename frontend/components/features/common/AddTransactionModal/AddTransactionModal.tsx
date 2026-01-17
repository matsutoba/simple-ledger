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
import { Spinner } from '@/components/ui/Spinner';

type TransactionFormData = z.infer<typeof transactionSchema>;

interface AddTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onExecute: () => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  open,
  onClose,
  onExecute,
}) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState<
    Partial<Record<keyof TransactionFormData, string>>
  >({});

  const resetForm = () => {
    setType('expense');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('');
    setDescription('');
    setAmount('');
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

    // zodで入力をバリデーション
    const result = transactionSchema.safeParse({
      type,
      date,
      category,
      description,
      amount,
    });

    if (!result.success) {
      // エラーをマッピング
      const fieldErrors: Partial<Record<keyof TransactionFormData, string>> =
        {};
      result.error.issues.forEach((error) => {
        const path = error.path[0] as keyof TransactionFormData;
        fieldErrors[path] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // バリデーション成功時
    setErrors({});

    // ここで取引データを保存するロジックを実装
    // 例: API呼び出しや状態管理ライブラリの更新など

    // フォームをリセット
    resetForm();

    // モーダルを閉じる
    onExecute();
  };

  return (
    <Modal
      isOpen={open}
      size="medium"
      onOpenChange={handleClose}
      title="取引を追加"
      description="取引の詳細を入力してください。"
      footer={
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button onClick={handleClose} variant="outline">
            キャンセル
          </Button>
          <Button onClick={handleSubmit}>保存</Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <BlockStack gap="sm">
          <Typography variant="small">種別</Typography>
          <div className="grid grid-cols-2 gap-3">
            <TransactionTypeButton
              type="income"
              selected={type === 'income'}
              onClick={() => handleTypeChange('income')}
            />
            <TransactionTypeButton
              type="expense"
              selected={type === 'expense'}
              onClick={() => handleTypeChange('expense')}
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

        <Suspense
          fallback={
            <div className="space-y-1">
              <label className="block text-sm font-medium">勘定科目</label>
              <Spinner size="sm" />
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
