import React from 'react';
import { Button as ShadcnButton } from '@/components/shadcn/ui/button';
import { cn } from '@/components/shadcn/ui/utils';
import { buttonColors, type ButtonColorKey } from '@/theme/colors';

type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';
type ButtonWidth = 'auto' | 'full';
type ButtonVariant = 'solid' | 'outline';

const widthMap: Record<ButtonWidth, string> = {
  auto: '',
  full: 'w-full',
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColorKey;
  size?: ButtonSize;
  width?: ButtonWidth;
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = 'primary',
      size = 'default',
      width = 'auto',
      variant = 'solid',
      isLoading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const widthClass = widthMap[width];

    let combinedClassName: string;

    if (variant === 'outline') {
      const outlineConfig = buttonColors[color].outline;
      combinedClassName = cn(
        widthClass,
        'border',
        outlineConfig.border,
        outlineConfig.text,
        outlineConfig.hover,
        'transition-colors cursor-pointer',
        className,
      );
    } else {
      const colorConfig = buttonColors[color];
      const bgClass = colorConfig.bg;
      const textClass = colorConfig.text;
      combinedClassName = cn(
        widthClass,
        bgClass,
        textClass,
        'hover:opacity-90 transition-opacity cursor-pointer',
        className,
      );
    }

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
