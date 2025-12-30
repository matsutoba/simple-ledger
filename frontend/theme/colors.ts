/**
 * カラーパレット定義
 * デジタル庁デザインシステムに準拠
 * https://design.digital.go.jp/dads/
 */

// キーカラー - プライマリーカラーの同一色相による4段階
export const keyColors = {
  primary: {
    primary: 'bg-blue-600',
    secondary: 'bg-blue-100',
    tertiary: 'bg-blue-50',
    background: 'bg-blue-25',
  },
} as const;

export type KeyColorLevel = keyof typeof keyColors.primary;

// セマンティックカラー - 機能的な意味を持つ色
export const semanticColors = {
  success: {
    primary: 'bg-green-600',
    secondary: 'bg-green-100',
    text: 'text-green-600',
  },
  error: {
    primary: 'bg-red-600',
    secondary: 'bg-red-100',
    text: 'text-red-500',
  },
  warning: {
    primary: 'bg-yellow-500',
    secondary: 'bg-yellow-100',
    text: 'text-yellow-600',
  },
} as const;

export type SemanticColorKey = keyof typeof semanticColors;

// 共通カラー - グレースケールと白黒
export const commonColors = {
  white: 'bg-white',
  gray50: 'bg-gray-50',
  gray100: 'bg-gray-100',
  gray200: 'bg-gray-200',
  gray400: 'bg-gray-400',
  gray600: 'bg-gray-600',
  gray900: 'bg-gray-900',
  black: 'bg-black',
  transparent: 'bg-transparent',
} as const;

export type CommonColorKey = keyof typeof commonColors;

// ボタンの色定義 - キーカラーとセマンティックカラーから構成
export const buttonColors = {
  primary: {
    bg: keyColors.primary.primary,
    text: 'text-white',
    description: 'プライマリアクション用',
  },
  secondary: {
    bg: keyColors.primary.secondary,
    text: 'text-gray-900',
    description: 'セカンダリアクション用',
  },
  success: {
    bg: semanticColors.success.primary,
    text: 'text-white',
    description: '成功・完了操作用',
  },
  error: {
    bg: semanticColors.error.primary,
    text: 'text-white',
    description: 'エラー・危険操作用',
  },
  warning: {
    bg: semanticColors.warning.primary,
    text: 'text-gray-900',
    description: '警告操作用',
  },
} as const;

export type ButtonColorKey = keyof typeof buttonColors;

// テキスト色定義 - キーカラーとセマンティックカラーから構成
export const textColors = {
  primary: keyColors.primary.primary.replace('bg-', 'text-'),
  secondary: 'text-gray-600',
  success: semanticColors.success.text,
  error: semanticColors.error.text,
  warning: semanticColors.warning.text,
  muted: 'text-gray-500',
} as const;

export type TextColorKey = keyof typeof textColors;

// アイコンバッジの色定義 - キーカラーとセマンティックカラーから構成
export const iconBadgeColors = {
  primary: {
    bg: keyColors.primary.primary,
    icon: 'text-white',
    description: 'プライマリバッジ',
  },
  secondary: {
    bg: keyColors.primary.secondary,
    icon: 'text-gray-900',
    description: 'セカンダリバッジ',
  },
  success: {
    bg: semanticColors.success.primary,
    icon: 'text-white',
    description: '成功バッジ',
  },
  error: {
    bg: semanticColors.error.primary,
    icon: 'text-white',
    description: 'エラーバッジ',
  },
  warning: {
    bg: semanticColors.warning.primary,
    icon: 'text-gray-900',
    description: '警告バッジ',
  },
} as const;

export type IconBadgeColorKey = keyof typeof iconBadgeColors;

// 背景色定義 - キーカラーと共通カラーから構成
export const bgColors = {
  primary: keyColors.primary.primary,
  secondary: keyColors.primary.secondary,
  success: semanticColors.success.primary,
  error: semanticColors.error.primary,
  warning: semanticColors.warning.primary,
  white: commonColors.white,
} as const;

export type BgColorKey = keyof typeof bgColors;

// グラデーション背景定義 - キーカラーから構成
export const gradientBgs = {
  primary: 'bg-gradient-to-br from-blue-50 to-indigo-100',
  secondary: 'bg-gradient-to-br from-gray-50 to-gray-100',
  success: 'bg-gradient-to-br from-green-50 to-emerald-100',
  error: 'bg-gradient-to-br from-red-50 to-rose-100',
  warning: 'bg-gradient-to-br from-yellow-50 to-amber-100',
} as const;

export type GradientBgKey = keyof typeof gradientBgs;

// シャドウ定義
export const shadows = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
} as const;

export type ShadowKey = keyof typeof shadows;

// 角丸定義
export const rounded = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;

export type RoundedKey = keyof typeof rounded;
