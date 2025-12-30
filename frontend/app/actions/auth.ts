'use server';

/**
 * Server Actions: サーバー側で実行される認証ロジック
 * フォーム送信時に使用し、セッションやクッキーも管理可能
 */

import { login as apiLogin, logout as apiLogout } from '@/lib/api/auth';
import { redirect } from 'next/navigation';

/**
 * ログインServer Action
 * @param email メールアドレス
 * @param password パスワード
 */
export async function loginAction(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  // API Client層を通じてログイン
  const result = await apiLogin(email, password);

  if (!result.data) {
    return {
      success: false,
      error: result.error || 'ログインに失敗しました',
    };
  }

  // 成功時はTOPにリダイレクト
  // redirect()は例外を投げるため、この後のコードは実行されない
  redirect('/');
}

/**
 * ログアウトServer Action
 */
export async function logoutAction(): Promise<void> {
  apiLogout();
  redirect('/login');
}
