import React from 'react';
import { Button as ShadcnButton } from '@/components/shadcn/ui/button';
import { cn } from '@/components/shadcn/ui/utils';
import { buttonColors, type ButtonColorKey } from '@/theme/colors';

type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';
type ButtonWidth = 'auto' | 'full';

const widthMap: Record<ButtonWidth, string> = {
  auto: '',
  full: 'w-full',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColorKey;
  size?: ButtonSize;
  width?: ButtonWidth;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = 'primary',
      size = 'default',
      width = 'auto',
      isLoading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const widthClass = widthMap[width];
    const colorConfig = buttonColors[color];
    const bgClass = colorConfig.bg;
    const textClass = colorConfig.text;
    const combinedClassName = cn(
      widthClass,
      bgClass,
      textClass,
      'hover:opacity-90 transition-opacity cursor-pointer',
      className,
    );

    return (
      <ShadcnButton
        ref={ref}
        variant="ghost"
        size={size}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
            読み込み中...
          </span>
        ) : (
          children
        )}
      </ShadcnButton>
    );
  },
);

Button.displayName = 'Button';
