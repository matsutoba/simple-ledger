'use client';

import { useState } from 'react';

/**
 * ダッシュボードトップページ
 * ログイン後のメインページ (localhost:3000/)
 */
export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<
    'dashboard' | 'transactions' | 'reports'
  >('dashboard');

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  return <main className="bg-gray-50">{/* Main Content */}</main>;
}
