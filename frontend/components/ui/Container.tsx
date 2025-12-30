import { ReactNode } from 'react';

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

const maxWidthMap: Record<MaxWidth, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
};

interface ContainerProps {
  maxWidth?: MaxWidth;
  className?: string;
  children: ReactNode;
}

export const Container = ({
  maxWidth = 'lg',
  className = '',
  children,
}: ContainerProps) => {
  const baseStyles = `mx-auto ${maxWidthMap[maxWidth]} w-full`;
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return <div className={combinedClassName}>{children}</div>;
};
