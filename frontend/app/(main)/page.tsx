import { DashboardPageClient } from '@/components/features/dashboard/DashboardPageClient';

/**
 * ダッシュボードトップページ
 * ログイン後のメインページ (localhost:3000/)
 */
export default function DashboardPage() {
  return (
    <main className="bg-gray-50">
      <DashboardPageClient />
    </main>
  );
}
