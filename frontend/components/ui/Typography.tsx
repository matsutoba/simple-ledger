import { ReactNode, ElementType } from 'react';

type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | '2xl'
  | 'xl'
  | 'large'
  | 'medium'
  | 'small'
  | 'xs'
  | 'p'
  | 'muted'
  | 'caption';

type TypographyColor =
  | 'default'
  | 'muted'
  | 'destructive'
  | 'secondary'
  | 'success';

type TextAlign = 'left' | 'center' | 'right' | 'justify';

interface TypographyProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  align?: TextAlign;
  bold?: boolean;
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: 'text-4xl font-bold tracking-tight',
  h2: 'text-3xl font-semibold tracking-tight',
  h3: 'text-2xl font-semibold tracking-tight',
  h4: 'text-xl font-semibold',
  '2xl': 'text-2xl',
  xl: 'text-xl',
  large: 'text-lg',
  medium: 'text-base',
  small: 'text-sm',
  xs: 'text-xs',
  p: 'text-base',
  muted: 'text-sm',
  caption: 'text-xs',
};

const colorStyles: Record<TypographyColor, string> = {
  default: 'text-gray-900',
  muted: 'text-gray-500',
  destructive: 'text-red-500',
  secondary: 'text-gray-600',
  success: 'text-green-600',
};

const alignStyles: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export const Typography = ({
  variant = 'p',
  color = 'default',
  align = 'left',
  bold = false,
  as,
  className = '',
  children,
}: TypographyProps) => {
  const Element =
    as ||
    (variant === 'h1' ||
    variant === 'h2' ||
    variant === 'h3' ||
    variant === 'h4'
      ? variant
      : 'p');
  const boldStyle = bold ? 'font-bold' : '';
  const baseStyles = `${variantStyles[variant]} ${colorStyles[color]} ${alignStyles[align]} ${boldStyle}`;
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return <Element className={combinedClassName}>{children}</Element>;
};
