import { ReactNode } from 'react';

type Spacing = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AlignItems = 'stretch' | 'flex-start' | 'center' | 'flex-end' | 'baseline';
type JustifyContent =
  | 'flex-start'
  | 'center'
  | 'flex-end'
  | 'space-between'
  | 'space-around'
  | 'space-evenly';

const spacingMap: Record<Spacing, string> = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const paddingMap: Record<Spacing, string> = {
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
};

const alignItemsMap: Record<AlignItems, string> = {
  stretch: 'items-stretch',
  'flex-start': 'items-start',
  center: 'items-center',
  'flex-end': 'items-end',
  baseline: 'items-baseline',
};

const justifyContentMap: Record<JustifyContent, string> = {
  'flex-start': 'justify-start',
  center: 'justify-center',
  'flex-end': 'justify-end',
  'space-between': 'justify-between',
  'space-around': 'justify-around',
  'space-evenly': 'justify-evenly',
};

interface StackProps {
  gap?: Spacing;
  padding?: Spacing;
  alignItems?: AlignItems;
  justifyContent?: JustifyContent;
  className?: string;
  children: ReactNode;
}

export const BlockStack = ({
  gap = 'md',
  padding,
  alignItems = 'stretch',
  justifyContent = 'flex-start',
  className = '',
  children,
}: StackProps) => {
  const baseStyles = `flex flex-col ${spacingMap[gap]} ${alignItemsMap[alignItems]} ${justifyContentMap[justifyContent]} ${
    padding ? paddingMap[padding] : ''
  }`;
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return <div className={combinedClassName}>{children}</div>;
};

export const InlineStack = ({
  gap = 'md',
  padding,
  alignItems = 'center',
  justifyContent = 'flex-start',
  className = '',
  children,
}: StackProps) => {
  const baseStyles = `flex flex-row ${spacingMap[gap]} ${alignItemsMap[alignItems]} ${justifyContentMap[justifyContent]} ${
    padding ? paddingMap[padding] : ''
  }`;
  const combinedClassName = `${baseStyles} ${className}`.trim();

  return <div className={combinedClassName}>{children}</div>;
};
