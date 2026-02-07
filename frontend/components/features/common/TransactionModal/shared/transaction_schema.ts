import { z } from 'zod';

const journalEntrySchema = z.object({
  chartOfAccountsId: z
    .union([z.string().min(1, '勘定科目を選択してください'), z.number()])
    .transform((val) => (typeof val === 'string' ? parseInt(val, 10) : val)),
  type: z.enum(['debit', 'credit'], {
    message: '借方または貸方を選択してください',
  }),
  amount: z
    .union([z.string().min(1, '金額を入力してください'), z.number()])
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
      .min(2, '取引には最低1つの借方エントリーと1つの貸方エントリーが必要です'),
  })
  .refine(
    (data) => {
      // 借方と貸方の両方が存在するか確認
      const hasDebit = data.journalEntries.some((e) => e.type === 'debit');
      const hasCredit = data.journalEntries.some((e) => e.type === 'credit');

      if (!hasDebit || !hasCredit) {
        return false;
      }

      // 借方合計 = 貸方合計を確認
      const debitTotal = data.journalEntries
        .filter((e) => e.type === 'debit')
        .reduce((sum, e) => sum + e.amount, 0);
      const creditTotal = data.journalEntries
        .filter((e) => e.type === 'credit')
        .reduce((sum, e) => sum + e.amount, 0);

      return debitTotal === creditTotal;
    },
    {
      message: '複式簿記ルール: 借方合計と貸方合計が一致していません',
      path: ['journalEntries'],
    },
  );

export type TransactionFormData = z.infer<typeof transactionSchema>;
