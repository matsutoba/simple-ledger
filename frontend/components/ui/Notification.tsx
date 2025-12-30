import React from 'react';
import { Icon } from './Icon';
import { semanticColors, keyColors } from '@/theme/colors';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationStyle = 'standard' | 'color-chip';

export interface NotificationProps {
  /**
   * 通知タイプ（セマンティックカラー）
   * - success: 操作等の滞りない完了の通知（緑）
   * - error: 操作等が正しく完了しなかったことの通知（赤）
   * - warning: 注意を喚起するための警告通知（黄）
   * - info: 情報提示（青または黒）
   */
  type: NotificationType;
  /**
   * 通知タイトル（必須）
   */
  title: string;
  /**
   * 通知の詳細説明（オプション）
   */
  description?: string;
  /**
   * デザインスタイル
   * - standard: 通常の角丸ボーダー
   * - color-chip: 左辺の太いボーダー
   */
  style?: NotificationStyle;
  /**
   * 背景色を使用するか
   */
  withBackground?: boolean;
  /**
   * 閉じるボタンを表示するか
   */
  onClose?: () => void;
  /**
   * アクションボタン
   */
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  /**
   * 日付情報を表示するか
   */
  date?: string;
}

const typeConfig: Record<
  NotificationType,
  {
    icon: 'check-circle' | 'x-circle' | 'alert-circle' | 'info';
    bg: string;
    border: string;
    borderChip: string;
    text: string;
    icon_color: string;
  }
> = {
  success: {
    icon: 'check-circle',
    bg: 'bg-green-50',
    border: 'border-green-300',
    borderChip: 'border-l-green-500',
    text: 'text-green-900',
    icon_color: semanticColors.success.text,
  },
  error: {
    icon: 'x-circle',
    bg: 'bg-red-50',
    border: 'border-red-300',
    borderChip: 'border-l-red-500',
    text: 'text-red-900',
    icon_color: semanticColors.error.text,
  },
  warning: {
    icon: 'alert-circle',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    borderChip: 'border-l-yellow-500',
    text: 'text-yellow-900',
    icon_color: semanticColors.warning.text,
  },
  info: {
    icon: 'info',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    borderChip: 'border-l-blue-500',
    text: 'text-blue-900',
    icon_color: keyColors.primary.primary.replace('bg-', 'text-'),
  },
};

/**
 * Notification コンポーネント
 * デジタル庁のNotification Bannerを参考に実装
 *
 * @example
 * <Notification
 *   type="error"
 *   title="ログインに失敗しました"
 *   description="メールアドレスまたはパスワードが正しくありません"
 *   onClose={() => setError('')}
 * />
 */
export const Notification: React.FC<NotificationProps> = ({
  type,
  title,
  description,
  style = 'standard',
  withBackground = false,
  onClose,
  action,
  date,
}) => {
  const config = typeConfig[type];

  const baseClasses = `
    flex gap-3 p-4 rounded
    ${style === 'color-chip' ? 'border-l-4' : ''}
    ${style === 'color-chip' ? config.borderChip : ''}
    ${withBackground ? config.bg : 'bg-white'}
    ${config.text}
  `;

  return (
    <div className={baseClasses} role="alert">
      {/* アイコン */}
      <div className="flex-shrink-0 pt-0.5">
        <Icon name={config.icon} className={`w-5 h-5 ${config.icon_color}`} />
      </div>

      {/* コンテンツ */}
      <div className="flex-grow">
        <h3 className="font-semibold text-sm">{title}</h3>
        {description && (
          <p className="text-sm mt-1 opacity-90">{description}</p>
        )}
        {date && <p className="text-xs mt-2 opacity-75">{date}</p>}
      </div>

      {/* アクションボタン */}
      {action && (
        <div className="flex-shrink-0">
          <button
            onClick={action.onClick}
            className={`
              px-3 py-1.5 rounded text-sm font-medium whitespace-nowrap
              transition-colors
              ${
                action.variant === 'secondary'
                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }
            `}
          >
            {action.label}
          </button>
        </div>
      )}

      {/* 閉じるボタン */}
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-xl leading-none opacity-60 hover:opacity-100 transition-opacity"
          aria-label="通知を閉じる"
        >
          ×
        </button>
      )}
    </div>
  );
};
