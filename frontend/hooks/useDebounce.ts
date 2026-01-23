'use client';

import { useEffect, useState } from 'react';

/**
 * 値のdebounceを行うカスタムフック
 * @param value - debounceする値
 * @param delayMs - debounce遅延時間（ミリ秒）
 * @returns debounceされた値
 */
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 遅延タイマーを設定
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    // クリーンアップ: 新しい値が入る前に前のタイマーをクリア
    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return debouncedValue;
}
