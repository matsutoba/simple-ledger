import { z } from 'zod';

export const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  date: z.string().date('有効な日付を入力してください'),
  category: z.string().min(1, 'カテゴリを選択してください'),
  description: z
    .string()
    .max(100, '説明は100文字以内で入力してください')
    .optional()
    .default(''),
  amount: z
    .string()
    .min(1, '金額を入力してください')
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      '0より大きい数値を入力してください',
    ),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
