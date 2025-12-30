/**
 * 認証フォームのバリデーションスキーマ
 * Zod を使用してスキーマ定義
 */

import { z } from 'zod';

/**
 * ログインフォームのバリデーションスキーマ
 */
export const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, 'メールアドレスを入力してください')
    .email('有効なメールアドレスを入力してください'),
  password: z
    .string()
    .min(1, 'パスワードを入力してください')
    .min(6, 'パスワードは6文字以上で入力してください'),
});

/**
 * ログインフォームの型定義
 */
export type LoginFormData = z.infer<typeof loginFormSchema>;
