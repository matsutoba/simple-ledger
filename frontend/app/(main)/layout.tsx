import { MainLayoutClient } from '@/components/features/layout/MainLayoutClient';
import type { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return <MainLayoutClient>{children}</MainLayoutClient>;
}
