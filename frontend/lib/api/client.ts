/**
 * API呼び出しの共通化層
 * 認証、エラーハンドリング、リトライロジックを一元管理
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  error: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * GETリクエスト
   */
  async get<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'GET' });
  }

  /**
   * POSTリクエスト
   */
  async post<T>(
    path: string,
    body?: Record<string, unknown>,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUTリクエスト
   */
  async put<T>(
    path: string,
    body?: Record<string, unknown>,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETEリクエスト
   */
  async delete<T>(
    path: string,
    options?: RequestInit,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(path, { ...options, method: 'DELETE' });
  }

  /**
   * 共通のリクエストロジック
   * - クッキーの自動送信
   * - エラーハンドリング
   * - リトライロジック
   */
  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path}`;

    // デフォルトヘッダー
    const headers = new Headers(options.headers || {});
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // クッキーを自動的に送信・受信
      });

      // ステータスコードが200-299の場合
      if (response.ok) {
        const data = await response.json();
        return {
          data,
          statusCode: response.status,
        };
      }

      // ステータスコードが401（認証失敗）の場合
      if (response.status === 401) {
        const errorData = await response.json().catch(() => ({}));
        return {
          error: errorData.error || '認証に失敗しました',
          statusCode: response.status,
        };
      }

      // その他のエラー
      const errorData = await response.json().catch(() => ({}));
      return {
        error: errorData.error || 'エラーが発生しました',
        statusCode: response.status,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'ネットワークエラーが発生しました';
      return {
        error: message,
        statusCode: 0,
      };
    }
  }

  /**
   * ログアウト
   * サーバー側でクッキーを無効化
   */
  async logout(): Promise<void> {
    // ログアウトエンドポイント（実装が必要）
    await this.post('/api/auth/logout', {});
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient();
