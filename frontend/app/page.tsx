'use client';

import { useState, useEffect } from 'react';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL || 'admin@example.com';
const DEMO_PASSWORD = process.env.NEXT_PUBLIC_DEMO_PASSWORD || 'password123';

export default function Home() {
  const [email, setEmail] = useState(DEMO_MODE ? DEMO_EMAIL : '');
  const [password, setPassword] = useState(DEMO_MODE ? DEMO_PASSWORD : '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [isDemoMode] = useState(DEMO_MODE);

  useEffect(() => {
    const savedToken = localStorage.getItem('accessToken');
    if (savedToken) {
      setIsLoggedIn(true);
      setToken(savedToken);
    } else if (DEMO_MODE) {
      // デモモード: 自動ログイン
      performLogin(DEMO_EMAIL, DEMO_PASSWORD);
    }
  }, []);

  const performLogin = async (loginEmail: string, loginPassword: string) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data: LoginResponse = await response.json();

      if (response.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setToken(data.accessToken);
        setIsLoggedIn(true);
        setMessage(`ログイン成功！ (有効期限: ${data.expiresIn}秒)`);
        setMessageType('success');
        setEmail('');
        setPassword('');
      } else {
        setMessage('ログイン失敗: メールアドレスまたはパスワードが正しくありません');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(`エラー: ${error instanceof Error ? error.message : 'サーバーに接続できません'}`);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(email, password);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setIsLoggedIn(false);
    setToken('');
    setMessage('ログアウトしました');
    setMessageType('success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">simple-ledger</h1>
          {isDemoMode && (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              DEMO
            </span>
          )}
        </div>

        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'ログイン中...' : 'ログイン'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">ログインしています</p>
              <p className="text-xs text-gray-500 break-all font-mono">
                Token: {token.substring(0, 30)}...
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            >
              ログアウト
            </button>
          </div>
        )}

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg text-sm ${
              messageType === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message}
          </div>
        )}

        {/* デモ用ユーザー情報 */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">📝 デモ用ユーザー:</p>
          <div className="bg-gray-50 rounded p-3 text-xs text-gray-700 space-y-1 font-mono">
            <p>メール: admin@example.com</p>
            <p>パスワード: password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
