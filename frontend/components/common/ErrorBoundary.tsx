import React from 'react';
import { Notification } from '@/components/ui/Notification';

interface Props {
  children: React.ReactNode;
  fallback?: (error: Error) => React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Suspenseから投げられるエラーをキャッチするErrorBoundary
 * useSuspenseQueryで発生したエラーを統一的に処理
 *
 * ⚠️ Error Boundaryはクラスコンポーネント専用
 * 理由: Error Boundaryのライフサイクルメソッド（getDerivedStateFromError、componentDidCatch）
 *       は React.Component クラスにのみ存在し、関数コンポーネントで実装できないため
 * 参考: React 18.2+ では useErrorBoundary() フックで関数コンポーネント化も可能だが、
 *      現在はクラスコンポーネント版で十分
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * getDerivedStateFromError
   * 役割: エラー発生時に同期的に呼ばれ、state を更新して UI を再レンダリング
   * タイミング: エラー発生時に即座に呼ばれる（同期）
   * 制限: 副作用（ログ記録など）は実行不可
   */
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  /**
   * componentDidCatch
   * 役割: エラー発生後に非同期で呼ばれ、副作用を実行（ログ記録、エラートラッキング等）
   * タイミング: getDerivedStateFromError の後、UI 更新後に呼ばれる
   * 用途: 将来的なエラーログ送信、Sentry等の外部サービス連携など
   */
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback?.(this.state.error) ?? (
          <ErrorFallback error={this.state.error} />
        )
      );
    }
    return this.props.children;
  }
}

/**
 * デフォルトのエラー表示UI
 */
const ErrorFallback = ({ error }: { error: Error }) => (
  <Notification
    type="error"
    title="データの取得に失敗しました"
    description={error.message}
    style="color-chip"
    withBackground
  />
);
