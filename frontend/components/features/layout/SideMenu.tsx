'use client';

import { Icon, type IconName } from '@/components/ui/Icon';
import { Typography } from '@/components/ui/Typography';
import { commonColors, keyColors } from '@/theme/colors';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems: { icon: IconName; label: string; href: string }[] = [
  { icon: 'home', label: 'ダッシュボード', href: '/' },
  { icon: 'dollar-sign', label: '取引', href: '/transactions' },
  { icon: 'bar-chart-3', label: 'レポート', href: '/analytics' },
];

interface SideMenuProps {
  onNavigate?: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({ onNavigate }) => {
  const pathname = usePathname();

  // 現在のパスに基づいて選択されたメニュー項目のインデックスを取得
  const selectedMenuItemIndex = menuItems.findIndex((item) => {
    if (item.href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(item.href);
  });

  return (
    <ul className="flex h-full flex-col">
      {menuItems.map((item, index) => (
        <li
          key={item.href}
          className={`rounded hover:${commonColors.gray100} ${index === selectedMenuItemIndex ? keyColors.primary.secondary : ''} p-2 mb-1`}
        >
          <Link
            href={item.href}
            className="flex items-center gap-2"
            onClick={onNavigate}
          >
            <Icon name={item.icon} className="size-4" />
            <Typography as="span">{item.label}</Typography>
          </Link>
        </li>
      ))}
      <li className="flex-1" />
    </ul>
  );
};
