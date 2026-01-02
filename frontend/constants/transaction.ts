/**
 * 取引関連の定数定義
 */

export const TRANSACTION_TYPE_COLORS = {
  income: 'text-green-600',
  expense: 'text-red-600',
  balance: 'text-blue-600',
} as const;

export const TRANSACTION_TYPE_BG_COLORS = {
  income: 'bg-green-100',
  expense: 'bg-red-100',
  balance: 'bg-blue-100',
} as const;

export const TRANSACTION_TYPE_HEX_COLORS = {
  income: '#16a34a',
  expense: '#dc2626',
  balance: '#2563eb',
} as const;

export const BALANCE_CHART_HEX_COLORS = {
  income: '#16a34a',
  expense: '#dc2626',
  balance: '#2563eb',
} as const;

export const TRANSACTION_TYPE_LABELS = {
  income: '収支',
  expense: '支出',
} as const;

export const TRANSACTION_TYPE_ICONS = {
  income: 'arrow-down-left',
  expense: 'arrow-up-right',
} as const;
