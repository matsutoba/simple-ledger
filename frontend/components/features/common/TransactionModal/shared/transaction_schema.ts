import { z } from 'zod';

const journalEntrySchema = z.object({
  chartOfAccountsId: z
    .string()
    .min(1, '勘定科目を選択してください')
    .transform((val) => parseInt(val, 10)),
  type: z.enum(['debit', 'credit'], {
    message: '借方または貸方を選択してください',
  }),
  amount: z
    .string()
    .min(1, '金額を入力してください')
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      '0より大きい数値を入力してください',
    )
    .transform((val) => Number(val)),
  description: z
    .string()
    .max(100, '説明は100文字以内で入力してください')
    .optional()
    .default(''),
});

export const transactionSchema = z
  .object({
    date: z.string().date('有効な日付を入力してください'),
    description: z
      .string()
      .max(100, '説明は100文字以内で入力してください')
      .optional()
      .default(''),
    journalEntries: z
      .array(journalEntrySchema)
      .min(2, '取引には最低2つの仕訳エントリーが必要です'),
  })
  .refine(
    (data) => {
      const debitTotal = data.journalEntries
        .filter((e) => e.type === 'debit')
        .reduce((sum, e) => sum + e.amount, 0);
      const creditTotal = data.journalEntries
        .filter((e) => e.type === 'credit')
        .reduce((sum, e) => sum + e.amount, 0);
      return debitTotal === creditTotal;
    },
    {
      message: '借方合計と貸方合計が一致していません',
      path: ['journalEntries'],
    },
  );

export type TransactionFormData = z.infer<typeof transactionSchema>;
