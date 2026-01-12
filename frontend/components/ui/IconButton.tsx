import React from 'react';
import { Button as ShadcnButton } from '@/components/shadcn/ui/button';
import { cn } from '@/components/shadcn/ui/utils';
import { Icon, type IconName } from '@/components/ui/Icon';
import { buttonColors, type ButtonColorKey } from '@/theme/colors';

type IconButtonSize = 'sm' | 'md' | 'lg';
type IconButtonVariant = 'solid' | 'outline' | 'ghost';

const sizeMap: Record<IconButtonSize, { container: string; iconSize: number }> =
  {
    sm: {
      container: 'w-8 h-8',
      iconSize: 16,
    },
    md: {
      container: 'w-10 h-10',
      iconSize: 20,
    },
    lg: {
      container: 'w-12 h-12',
      iconSize: 24,
    },
  };

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName;
  color?: ButtonColorKey;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
  isLoading?: boolean;
  ariaLabel?: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      color = 'primary',
      size = 'md',
      variant = 'solid',
      isLoading = false,
      disabled,
      className,
      ariaLabel,
      ...props
    },
    ref,
  ) => {
    const { container, iconSize } = sizeMap[size];

    let combinedClassName: string;

    if (variant === 'outline') {
      const outlineConfig = buttonColors[color].outline;
      combinedClassName = cn(
        'rounded-md p-0 flex items-center justify-center',
        container,
        'border',
        outlineConfig.border,
        outlineConfig.text,
        outlineConfig.hover,
        'transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        className,
      );
    } else if (variant === 'ghost') {
      const textConfig = buttonColors[color];
      combinedClassName = cn(
        'rounded-md p-0 flex items-center justify-center',
        container,
        textConfig.text,
        'hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        className,
      );
    } else {
      const colorConfig = buttonColors[color];
      const bgClass = colorConfig.bg;
      const textClass = colorConfig.text;
      combinedClassName = cn(
        'rounded-md p-0 flex items-center justify-center',
        container,
        bgClass,
        textClass,
        'hover:opacity-90 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white',
        className,
      );
    }

    return (
      <ShadcnButton
        ref={ref}
        variant="ghost"
        size="icon"
        disabled={disabled || isLoading}
        className={combinedClassName}
        aria-label={ariaLabel}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
        ) : (
          <Icon name={icon} size={iconSize} />
        )}
      </ShadcnButton>
    );
  },
);

IconButton.displayName = 'IconButton';
