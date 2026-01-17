import { toast } from 'sonner';

/**
 * Toast ユーティリティ
 *
 * 各コンポーネントで以下のようにインポートして使用します：
 * import { showSuccessToast, showErrorToast, showInfoToast } from '@/components/ui/Toast';
 *
 * 使用例：
 *
 * // 基本的な使用方法
 * showSuccessToast('保存しました');
 * showErrorToast('エラーが発生しました');
 * showInfoToast('このはコンテンツです');
 * showWarningToast('注意してください');
 *
 * // 説明付き
 * showSuccessToast('取引を保存しました', {
 *   description: '取引 ID: 12345',
 * });
 *
 * // カスタム期間
 * showErrorToast('エラーが発生しました', {
 *   duration: 5000,
 *   description: 'もう一度お試しください',
 * });
 *
 * // アクション付き
 * showInfoToast('新しいバージョンがあります', {
 *   action: {
 *     label: 'アップデート',
 *     onClick: () => window.location.reload(),
 *   },
 * });
 *
 * // ローディング + 更新
 * const toastId = showLoadingToast('保存中...');
 * setTimeout(() => {
 *   updateToast(toastId, '保存しました', 'success');
 * }, 2000);
 *
 * // トースト ID を指定して手動制御
 * const id = showLoadingToast('処理中...');
 * dismissToast(id); // 特定のトースト非表示
 * dismissAllToasts(); // すべてのトースト非表示
 */

export interface ToastOptions {
  duration?: number;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * 成功トースト
 */
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    duration: options?.duration ?? 3000,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * エラートースト
 */
export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    duration: options?.duration ?? 4000,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * 情報トースト
 */
export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast.info(message, {
    duration: options?.duration ?? 3000,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * 警告トースト
 */
export const showWarningToast = (message: string, options?: ToastOptions) => {
  return toast.warning(message, {
    duration: options?.duration ?? 3000,
    description: options?.description,
    action: options?.action,
  });
};

/**
 * ローディングトースト
 */
export const showLoadingToast = (message: string, options?: ToastOptions) => {
  return toast.loading(message, {
    duration: options?.duration ?? 5000,
    description: options?.description,
  });
};

/**
 * トースト ID を指定して更新
 */
export const updateToast = (
  id: string | number,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info',
) => {
  toast[type](message, {
    id: id.toString(),
    duration: 3000,
  });
};

/**
 * トースト ID を指定して非表示
 */
export const dismissToast = (id: string | number) => {
  toast.dismiss(id);
};

/**
 * すべてのトースト非表示
 */
export const dismissAllToasts = () => {
  toast.dismiss();
};

/**
 * Toastプロバイダーコンポーネント
 * 上位のコンポーネントでプロバイダとして使用してください
 * import { ToastProvider } from '@/components/ui/Toast';
 */
import { Toaster as SonnerToaster } from '@/components/shadcn/ui/sonner';
import { toastColors } from '@/theme/colors';

export const ToastProvider = () => {
  // ライト/ダークテーマの判定（prefers-color-scheme）
  const isDark =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches;

  const theme = isDark ? toastColors.dark : toastColors.light;

  return (
    <SonnerToaster
      style={
        {
          '--normal-bg': theme.normal.bg,
          '--normal-text': theme.normal.text,
          '--normal-border': theme.normal.border,
          '--success-bg': theme.success.bg,
          '--success-text': theme.success.text,
          '--error-bg': theme.error.bg,
          '--error-text': theme.error.text,
          '--warning-bg': theme.warning.bg,
          '--warning-text': theme.warning.text,
        } as React.CSSProperties
      }
    />
  );
};
