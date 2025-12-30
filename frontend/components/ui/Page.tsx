import { ReactNode } from 'react';
import { gradientBgs, type GradientBgKey } from '@/theme/colors';

interface PageProps {
  gradientBg?: GradientBgKey;
  padding?: 'sm' | 'md' | 'lg';
  centered?: boolean;
  className?: string;
  children: ReactNode;
}

const paddingMap = {
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-4',
};

export const Page = ({
  gradientBg = 'primary',
  padding = 'md',
  centered = false,
  className = '',
  children,
}: PageProps) => {
  const centerStyles = centered ? 'items-center justify-center' : '';
  const baseStyles = `min-h-screen ${gradientBgs[gradientBg]} ${paddingMap[padding]} flex ${centerStyles}`;
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return <div className={combinedClassName}>{children}</div>;
};
