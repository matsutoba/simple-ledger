import type { AccountType } from '@/types/chartOfAccount';

export const AccountTypeName: Record<AccountType, string> = {
  asset: '資産',
  liability: '負債',
  equity: '純資産',
  revenue: '収入',
  expense: '支出',
};
