# フロントエンド コーディングルール

## 📝 基本設定

- **言語**: TypeScript（`strict: true`）
- **スタイル**: Tailwind CSS + App Router
- **ファイル命名**: kebab-case (`.tsx`, `.ts`)
- **フォーマット**: ESLint で自動整形（保存時）
- **パッケージマネージャー**: pnpm を使用
- **テスト**: Jest で実行（`pnpm test`, `pnpm test:watch`, `pnpm test:coverage`）
- **ロックファイル**: `pnpm-lock.yaml` をコミット（依存関係の再現性確保）
- **Lint 設定**: [frontend/eslint.config.mjs](../frontend/eslint.config.mjs) を参照
  - ESLint 9 + Next.js Core Web Vitals + TypeScript 対応
  - jest.config.js, jest.setup.js は除外

---

## API クライアント層の共通化

### 層の責任分離

- **API Client** (`lib/api/client.ts`): HTTP 通信の統一化
  - 認証トークンの自動付与
  - エラーハンドリングの統一
  - リトライロジックなどの拡張性を確保
- **API 関数** (`lib/api/{feature}.ts`): ドメイン固有の API 関数
  - `apiClient` を使用して HTTP 通信を実行
  - トークン保存などのビジネスロジックを実装
  - 型安全なリクエスト/レスポンスを定義
- **Server Action** (`app/actions/{feature}.ts`): サーバーサイド処理
  - API 関数層を呼び出す（`'use server'` で実行）
  - ページリダイレクト、セッション管理など
- **使用パターン**:
  - **Server Action から**: `import { login } from '@/lib/api/auth'` で API 関数を呼び出し
  - **クライアントコンポーネントから**: Server Action または API 関数を直接呼び出し
  - どちらの場合も同じ API 関数を使用する（コード重複を避ける）

### 例 (ログイン)

```typescript
// lib/api/auth.ts - API関数層
export async function login(email, password) {
  const response = await apiClient.post('/api/auth/login', { email, password });
  if (response.data) apiClient.setTokens(...);
  return response;
}

// app/actions/auth.ts - Server Action
export async function loginAction(email, password) {
  const result = await login(email, password);
  if (result.data) redirect('/');
}

// components/features/auth/LoginForm.tsx - UI層
const result = await loginAction(email, password);
```

---

## コンポーネント管理

### ディレクトリ分類

- **shadcn/ui**: `frontend/components/shadcn/ui/` に配置（Figma Make 生成コンポーネント含む）
- **拡張 UI コンポーネント**: `frontend/components/ui/` に配置（shadcn/ui を拡張・カスタマイズしたコンポーネント）
- **機能コンポーネント**: `frontend/components/features/{feature}/` に配置（業務ロジックを含むコンポーネント）

### インポート規則

- **インポート**: `@/components/` エイリアスを使用（パス解決は `tsconfig.json` の `"@/*": ["./*"]` で設定）
- **コンポーネント再利用**: 新規コンポーネント作成時は既存の shadcn/ui or `components/ui` コンポーネントを活用
- **階層構造**: `shadcn/ui` ← `ui/` ← `features/` の依存方向を保つ（逆方向の依存は避ける）

---

## 🎨 デザインシステム（デジタル庁準拠）

本プロジェクトは、**デジタル庁デザインシステム** に準拠します。

参考: https://design.digital.go.jp/dads/

### 原則

すべてのフロントエンド開発において、デジタル庁のデザインシステムを基準に:

- セマンティックカラー（primary、secondary、success、error、warning）を使用
- アクセシビリティを重視（コントラスト比 4.5:1 以上）
- 日本政府のサイトと一貫性のあるデザインを目指す

### カラーシステム

色は UI ライブラリに依存しないように、**`theme/colors.ts`** に一元管理。

#### ファイル構成

```
frontend/
└── theme/
    ├── colors.ts    # カラーパレット定義（デジタル庁準拠）
    └── theme.ts     # デザイントークン定義
```

#### `theme/colors.ts` - カラーパレット定義

**3 つのカラー体系から構成:**

1. **keyColors** - キーカラー

   - プライマリーカラーの 4 段階：primary（濃）→ secondary（薄）→ tertiary → background

2. **semanticColors** - セマンティックカラー（機能的な意味）

   - `success` - 成功・完了（緑）
   - `error` - エラー・危険（赤）
   - `warning` - 警告（黄色）

3. **commonColors** - 共通カラー
   - グレースケール（white、gray50 ～ gray900、black）

#### コンポーネントで使用するカラー

すべてのコンポーネントは以下の **5 つの語義的色名** のみを使用：

- **primary** - メインアクション
- **secondary** - サブアクション
- **success** - 成功・完了
- **error** - エラー・削除・危険
- **warning** - 警告

#### Button コンポーネントでの使用

```tsx
import { buttonColors, type ButtonColorKey } from "@/theme/colors";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColorKey; // 'primary' | 'secondary' | 'success' | 'error' | 'warning'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color = "primary", ...props }, ref) => {
    const colorConfig = buttonColors[color];
    const combinedClassName = cn(widthClass, colorConfig.bg, colorConfig.text);
    return (
      <ShadcnButton variant="ghost" className={combinedClassName} {...props} />
    );
  }
);
```

**使用例:**

```tsx
<Button color="primary">ログイン</Button>
<Button color="secondary">キャンセル</Button>
<Button color="success">完了</Button>
<Button color="error">削除</Button>
<Button color="warning">注意</Button>
```

#### 作成済みコンポーネント と色対応

- **Button**: color ∈ {primary, secondary, success, error, warning}
- **IconBadge**: color ∈ {primary, secondary, success, error, warning}
- **Typography**: color ∈ {primary, secondary, success, error, warning, muted}
- **Page**: gradientBg ∈ {primary, secondary, success, error, warning}

---

## 🎨 フロントエンド コンポーネント開発ガイドライン

### コンポーネント分割の基準

#### `components/ui/`（再利用可能な UI 部品）

- 複数の画面で使う可能性のあるコンポーネント
- ビジネスロジックを含まない
- 例：Typography, Button, Card, Stack, Icon など

#### `components/features/`（機能固有のコンポーネント）

- 特定の機能・ページでのみ使用するコンポーネント
- ビジネスロジック・状態管理を含む
- 例：LoginForm, UserProfile など

#### 昇格ルール

他のページでも使うコンポーネントが現れた場合、`components/ui/` に移動させる。

### プロップ設計の原則

#### 基本ルール

- **Tailwind クラス文字列は極力避ける** - `className="text-center"` ❌
- **列挙型で制御する** - `align="center"` ✅
- **デフォルト値を明示する** - 利用者の手間を減らす

#### プロップ数の管理

- プロップが 10 個以上になる場合は、新しいコンポーネントへの分割を検討
- 関連するプロップはグループ化（例：`color`, `bgColor` など）

### Tailwind 使用禁止ルール

#### 禁止パターン

**1. スペーシング（`p-*`, `m-*`, `gap-*`）**

- ❌ `<div className="p-8 gap-4">`
- ✅ `<Card padding="lg">`, `<BlockStack gap="lg">`

**2. 色・背景（`text-*`, `bg-*`）**

- ❌ `<div className="text-center text-gray-500">`
- ✅ `<Typography align="center" color="muted">`

**3. サイズ（`w-*`, `h-*`）**

- ❌ `<Button className="w-full h-12">`
- ✅ `<Button width="full" size="lg">`

**4. 配置（`flex`, `items-center`, `justify-center`）**

- ❌ `<div className="flex items-center justify-center">`
- ✅ `<InlineStack alignItems="center" justifyContent="center">`

**5. その他（`rounded-*`, `shadow-*`）**

- ❌ `<Card className="rounded-xl shadow-lg">`
- ✅ `<Card rounded="xl" shadow="lg">`

### 新規コンポーネント作成時のチェックリスト

#### 1. 型定義

- [ ] `Record<Type, string>` マップで値を管理
- [ ] 型名は `<ComponentName>Props` にする
- [ ] デフォルト値を `Props` インターフェースに記載

#### 2. クラス合成

- [ ] 複数クラスの合成には `cn()` を使う
- [ ] 末尾に `.trim()` で不要な空白を削除

#### 3. コンポーネント実装

- [ ] `React.forwardRef` を使用（再利用性向上）
- [ ] `displayName` を設定（デバッグ時に便利）

### 命名規則

#### ファイル・コンポーネント名

- PascalCase を使用
- 例：`Button.tsx`, `IconBadge.tsx`, `TextField.tsx`

### 作成済みコンポーネント一覧

#### レイアウト系

- **`BlockStack`**, **`InlineStack`**: `gap`, `padding`, `alignItems`, `justifyContent`
- **`Card`**: `padding`, `rounded`, `shadow`
- **`Container`**: `maxWidth`
- **`Page`**: `gradientBg` ∈ {primary, secondary, success, error, warning}, `centered`, `padding`

#### テキスト系

- **`Typography`**: `variant`, `color` ∈ {primary, secondary, success, error, warning, muted}, `align`, `as`

#### フォーム系

- **`TextField`**: `label`, `icon`, 標準 input 属性
- **`Button`**: `color` ∈ {primary, secondary, success, error, warning}, `size`, `width`, `isLoading`

#### アイコン系

- **`Icon`**: `name`, `size`
- **`IconBadge`**: `icon`, `color` ∈ {primary, secondary, success, error, warning}, `size`

---

## 📦 定数・型管理ガイドライン

### ディレクトリ構造

```
frontend/
├── types/                   # 共通型定義
│   ├── transaction.ts       # 取引関連の型
│   └── index.ts            # エクスポート
├── constants/               # 業務定数
│   ├── transaction.ts      # 取引関連の定数（色、ラベル、アイコン）
│   └── index.ts            # エクスポート
└── components/
```

### 定数管理のルール

#### 1. **定数の分類と配置**

- **`theme/colors.ts`**: デザインシステムカラー（Tailwind クラス、HEX カラー）
- **`constants/`**: 業務定数（ラベル、アイコン、色の組み合わせなど）

#### 2. **定数の構造パターン**

取引（Transaction）を例にした定数定義：

```typescript
// constants/transaction.ts

// テキストカラー（Tailwind クラス）- UI 表示用
export const TRANSACTION_TYPE_COLORS = {
  income: "text-green-600",
  expense: "text-red-600",
} as const;

// 背景色 + テキスト（Tailwind クラス）- Badge/Tag 用
export const TRANSACTION_TYPE_BG_COLORS = {
  income: "bg-green-100",
  expense: "bg-red-100",
} as const;

// HEX カラー - Recharts/グラフライブラリ用
export const TRANSACTION_TYPE_HEX_COLORS = {
  income: "#16a34a", // green-600
  expense: "#dc2626", // red-600
} as const;

// グラフ用カラー（複数タイプ対応）
export const BALANCE_CHART_HEX_COLORS = {
  income: "#16a34a", // green-600
  expense: "#dc2626", // red-600
  balance: "#2563eb", // blue-600
} as const;

// テキストラベル
export const TRANSACTION_TYPE_LABELS = {
  income: "収支",
  expense: "支出",
} as const;

// アイコン名
export const TRANSACTION_TYPE_ICONS = {
  income: "arrow-down-left",
  expense: "arrow-up-right",
} as const;
```

#### 3. **使用パターン**

```typescript
// コンポーネントから使用
import { TRANSACTION_TYPE_COLORS, TRANSACTION_TYPE_LABELS } from '@/constants';

// テキスト色を適用
<Typography className={TRANSACTION_TYPE_COLORS.income}>
  {TRANSACTION_TYPE_LABELS.income}
</Typography>

// グラフに HEX カラーを使用
<Bar
  dataKey="収入"
  fill={TRANSACTION_TYPE_HEX_COLORS.income}
/>
```

#### 4. **定数追加のチェックリスト**

- [ ] 同じ値が複数個所で使われているか確認
- [ ] `as const` で型推論を厳密にする
- [ ] `theme/colors.ts` の Tailwind カラーと HEX 値が対応しているか確認（Tailwind の標準色を使用：green-600 = #16a34a など）
- [ ] 定数名は大文字スネークケース（`TRANSACTION_TYPE_COLORS`）
- [ ] `constants/index.ts` で再エクスポート

### 型定義（types/）のルール

```typescript
// types/transaction.ts

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string; // YYYY-MM-DD
  amount: number;
  description: string;
}

export interface MonthlyTransactionData {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  balance: number; // income - expense
}
```

### 共通利用される値の統一化

**プロジェクト全体で同じ値を使う場合は定数化：**

```typescript
// 悪い例
<Typography className="text-green-600">収支</Typography>
<Bar fill="#10b981" />  // 同じ緑色だが値が異なる

// 良い例（定数化）
import { TRANSACTION_TYPE_COLORS, TRANSACTION_TYPE_HEX_COLORS } from '@/constants';

<Typography className={TRANSACTION_TYPE_COLORS.income}>
  {TRANSACTION_TYPE_LABELS.income}
</Typography>
<Bar fill={TRANSACTION_TYPE_HEX_COLORS.income} />
```

---

## 🎨 コンポーネント開発ガイドライン（追加）

### レイアウトコンポーネントの使用ルール

#### `InlineStack`（横並び）と`BlockStack`（縦積み）

```typescript
// InlineStack: alignItems のデフォルトは "center"
// 上詰めにしたい場合は alignItems="flex-start" を明示

// ❌ デフォルト（中央揃え）
<InlineStack>
  <aside className="..." />
  {children}
</InlineStack>

// ✅ 上詰めする場合
<InlineStack alignItems="flex-start">
  <aside className="..." />
  {children}
</InlineStack>
```

### Grid レイアウトの標準化

ダッシュボードの統計カード（3 列）など：

```typescript
// ✅ 推奨：標準 Tailwind グリッド
<div className="w-full grid grid-cols-3 gap-4">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

// ❌ 非推奨：カスタム クラス名
<div className="w-full grid custom-grid-cols-3 gap-4">
```

### CSS 定数化のパターン

複数箇所で同じ className が使われる場合：

```typescript
// テーブルセルの例
const HEADER_CELL_STYLE = 'border-b border-gray-400 text-gray-700 font-medium px-4 py-2 text-left';
const BODY_CELL_STYLE = 'border-b border-gray-200 px-4 py-2';

<th className={HEADER_CELL_STYLE}>日付</th>
<td className={BODY_CELL_STYLE}>...</td>
```

### Typography バリアント（拡張）

`large` と `medium` バリアントを追加で使用可能：

```typescript
// Typography.tsx で定義済み
// - large: text-2xl（太字なし）
// - medium: text-base（太字なし）

// 使用例
<Typography variant="large">大きいテキスト</Typography>
<Typography variant="medium">中くらいのテキスト</Typography>
```

---

## 🔍 Dashboard コンポーネント開発例

### コンポーネント構成

```
components/features/dashboard/
├── Dashboard.tsx                # メインダッシュボード
├── TrendCard.tsx               # 統計カード（収入・支出・収支）
├── BalanceTrendChart.tsx       # 推移チャート（折れ線グラフ）
├── MonthlyBalanceChart.tsx     # 月別比較チャート（棒グラフ）
├── RecentTransactionList.tsx   # 最近の取引一覧
└── TransactionTypeIcon.tsx     # 取引タイプアイコン（Badge）
```

### ダッシュボード開発時のパターン

#### 1. データ型定義

```typescript
// types/transaction.ts
export interface Transaction {
  id: string;
  type: "income" | "expense";
  date: string;
  amount: number;
  description: string;
}
```

#### 2. 定数定義

```typescript
// constants/transaction.ts
export const TRANSACTION_TYPE_COLORS = { ... };
export const TRANSACTION_TYPE_HEX_COLORS = { ... };
```

#### 3. 機能コンポーネント

```typescript
// components/features/dashboard/Dashboard.tsx
import { TrendCard } from './TrendCard';
import { BalanceTrendChart } from './BalanceTrendChart';

export const Dashboard = () => {
  const transactions = [...];  // API から取得

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        <TrendCard type="trending-up" amount={...} />
        <TrendCard type="trending-down" amount={...} />
        <TrendCard type="wallet" amount={...} />
      </div>
      <BalanceTrendChart transactions={transactions} />
    </div>
  );
};
```

### Typography 使用時の注意

金額表示など数値の 3 桁区切りが必要な場合：

```typescript
// ✅ 推奨
<Typography variant="large">
  ¥{Number(amount).toLocaleString()}
</Typography>

// ❌ 非推奨
<Typography variant="large">
  ¥{amount}
</Typography>
```

---

## 🔧 Button コンポーネント拡張ガイド

### variant プロパティの追加

Button コンポーネントに `variant` プロパティを追加して、背景色有無を制御：

```typescript
interface ButtonProps {
  variant?: "solid" | "outline"; // デフォルト: 'solid'
  color?: ButtonColorKey;
  // ...
}
```

#### outline バリアント

枠線のみで背景色なしの表示：

```typescript
// ✅ 推奨：outline バリアントを使用
<Button variant="outline" color="primary">
  外枠ボタン
</Button>;

// outline 時の色設定
const outlineColorMap = {
  primary: {
    border: "border-blue-600",
    text: "text-blue-600",
    hover: "hover:bg-blue-50",
  },
  secondary: {
    border: "border-blue-100",
    text: "text-gray-900",
    hover: "hover:bg-blue-50",
  },
  // ...
} as const;
```

---

## 💡 コード生成時のガイドライン

### フロントエンド

1. **ESLint ルール準拠**

   - 設定ファイル: [eslint.config.mjs](../frontend/eslint.config.mjs)
   - `const` 推奨、`let` は必要な場合のみ
   - 未使用変数を避ける
   - React Hooks の依存関係を正しく指定

2. **TypeScript 型定義**

   - 全ての関数に戻り値の型を指定
   - `any` は使わない（代わりに `unknown` を検討）
   - React コンポーネントは Props の型定義を明記

3. **テスト対応**
   - テストはすぐに実行できるようにコード生成
   - `jest.config.js` の設定に従う

---

## 💡 コード分析時のポイント

1. **App Router（`app/` ディレクトリ内）を確認**
2. **TypeScript の型定義を優先**
3. **pnpm-lock.yaml は version control に含まれている**
