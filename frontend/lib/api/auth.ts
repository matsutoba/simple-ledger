/**
 * 認証関連のAPI呼び出し関数
 * API Clientを使用して共通化されたロジックで実装
 */

import { apiClient, ApiResponse } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  // トークンはHttpOnly Cookieに格納されるため、ここには含めない
  expiresIn: number;
}

/**
 * ログインAPIを呼び出す
 * トークンはHttpOnly Cookieに自動設定される
 * @param email メールアドレス
 * @param password パスワード
 * @returns ログイン結果
 */
export async function login(
  email: string,
  password: string,
): Promise<ApiResponse<LoginResponse>> {
  const response = await apiClient.post<LoginResponse>('/api/auth/login', {
    email,
    password,
  });

  // トークンはサーバーが HttpOnly Cookie に設定済み
  // クライアント側で何もする必要はない

  return response;
}

/**
 * トークンをリフレッシュする
 * @returns 新しいアクセストークン
 */
export async function refreshToken(): Promise<
  ApiResponse<{ accessToken: string }>
> {
  // リフレッシュトークンは HttpOnly Cookie に保存されるため
  // リクエストを送るだけでサーバー側で参照される
  return apiClient.post('/api/auth/refresh', {});
}

/**
 * ログアウト
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
