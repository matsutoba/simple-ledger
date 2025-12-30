import { ReactNode } from 'react';

type Shadow = 'sm' | 'md' | 'lg';
type Rounded = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const shadowMap: Record<Shadow, string> = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const roundedMap: Record<Rounded, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const paddingMap: Record<Spacing, string> = {
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

interface CardProps {
  padding?: Spacing;
  shadow?: Shadow;
  rounded?: Rounded;
  className?: string;
  children: ReactNode;
}

export const Card = ({
  padding = 'md',
  shadow = 'md',
  rounded = 'lg',
  className = '',
  children,
}: CardProps) => {
  const baseStyles = `bg-white ${paddingMap[padding]} ${shadowMap[shadow]} ${roundedMap[rounded]}`;
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return <div className={combinedClassName}>{children}</div>;
};
