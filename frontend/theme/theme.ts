/**
 * デザイントークン定義
 * 色、スペーシング、タイポグラフィなど、プロジェクト全体のデザイン定数
 */

export const spacing = {
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
} as const;

export type SpacingKey = keyof typeof spacing;

export const gap = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
} as const;

export type GapKey = keyof typeof gap;

export const fontSize = {
  h1: 'text-4xl',
  h2: 'text-3xl',
  h3: 'text-2xl',
  h4: 'text-xl',
  p: 'text-base',
  small: 'text-sm',
  xs: 'text-xs',
} as const;

export type FontSizeKey = keyof typeof fontSize;

export const fontWeight = {
  bold: 'font-bold',
  semibold: 'font-semibold',
  medium: 'font-medium',
  normal: 'font-normal',
} as const;

export const maxWidth = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
} as const;

export type MaxWidthKey = keyof typeof maxWidth;

export const buttonSize = {
  sm: { height: 'h-8', padding: 'px-3 py-2' },
  md: { height: 'h-10', padding: 'px-4 py-2' },
  lg: { height: 'h-12', padding: 'px-6 py-3' },
} as const;

export type ButtonSizeKey = keyof typeof buttonSize;

// 全デザイントークンを一つのオブジェクトにまとめる
export const theme = {
  spacing,
  gap,
  fontSize,
  fontWeight,
  maxWidth,
  buttonSize,
} as const;
