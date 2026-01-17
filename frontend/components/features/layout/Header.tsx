import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Typography } from '@/components/ui/Typography';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuToggle?: () => void;
}

/**
 * メインアプリケーションレイアウト（ログイン後）
 * ダッシュボード・機能ページに適用
 * 今後、ナビゲーションバーやサイドバーを追加
 */
export const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiClient.logout();
      // ログアウト成功後、ログインページにリダイレクト
      router.push('/login');
    } catch (error) {
      console.error('ログアウトに失敗しました:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 h-12">
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            className="lg:hidden"
            variant="outline"
            size="icon"
            onClick={onMenuToggle}
            aria-label="サイドメニューを開く"
          >
            <Icon name="menu" className="text-gray-700" />
          </Button>
          <Typography variant="h4">会計アプリ</Typography>
        </div>
        <Button
          color="secondary"
          size="sm"
          variant="outline"
          onClick={handleLogout}
        >
          <Icon name="logout" />
          <span className="hidden sm:inline">ログアウト</span>
        </Button>
      </div>
    </header>
  );
};
