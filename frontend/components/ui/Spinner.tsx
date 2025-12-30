import React from 'react';
import { spinnerSize, type SpinnerSizeKey } from '@/theme/theme';

export interface SpinnerProps {
  /**
   * スピナーのサイズ
   * - sm: 小（w-4 h-4）
   * - md: 中（w-8 h-8）（デフォルト）
   * - lg: 大（w-12 h-12）
   */
  size?: SpinnerSizeKey;
  /**
   * 画面全体をマスクして中央に表示するか
   * true の場合、半透明の背景が画面全体に表示され、クリック操作が無効化される
   * false の場合、親コンテナに対して中央に表示される
   */
  fullscreen?: boolean;
  /**
   * アクセシビリティ用のラベル
   */
  label?: string;
  /**
   * マスクの不透明度（fullscreen=true の場合のみ使用）
   * 0-100 のパーセンテージ、デフォルト: 30
   */
  maskOpacity?: number;
}

/**
 * Spinner コンポーネント
 * API実行中に表示するスピナー
 *
 * @example
 * // 親コンテナに対して中央表示
 * <Spinner size="md" />
 *
 * @example
 * // 画面中央に表示＆マスク
 * <Spinner fullscreen size="lg" label="読み込み中..." />
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  fullscreen = false,
  label = '読み込み中...',
  maskOpacity = 30,
}) => {
  const spinnerClass = spinnerSize[size];

  const spinnerContent = (
    <div
      className={`
        ${spinnerClass}
        border-4 border-gray-200 rounded-full
        animate-spin
        border-t-blue-600 border-r-blue-600
      `}
      role="status"
      aria-label={label}
    >
      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{
          backgroundColor: `rgba(0, 0, 0, ${maskOpacity / 100})`,
        }}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          {spinnerContent}
          {label && <p className="text-white text-sm font-medium">{label}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">{spinnerContent}</div>
  );
};
