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
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * ログインAPIを呼び出す
 * @param email メールアドレス
 * @param password パスワード
 * @returns ログイン結果（トークン）
 */
export async function login(
  email: string,
  password: string,
): Promise<ApiResponse<LoginResponse>> {
  const response = await apiClient.post<LoginResponse>('/api/auth/login', {
    email,
    password,
  });

  // ログイン成功時はトークンを保存
  if (response.data) {
    apiClient.setTokens(response.data.accessToken, response.data.refreshToken);
  }

  return response;
}

/**
 * トークンをリフレッシュする
 * @returns 新しいアクセストークン
 */
export async function refreshToken(): Promise<
  ApiResponse<{ accessToken: string }>
> {
  const refreshToken = localStorage.getItem('refreshToken');

  if (!refreshToken) {
    return {
      error: 'リフレッシュトークンが見つかりません',
      statusCode: 401,
    };
  }

  return apiClient.post('/api/auth/refresh', {
    refreshToken,
  });
}

/**
 * ログアウト
 */
export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
}
