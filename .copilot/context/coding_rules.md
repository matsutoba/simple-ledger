# simple-ledger プロジェクト コンテキスト

## 🎯 プロジェクト概要

シンプルな会計アプリケーション。フロントエンド（Next.js）とバックエンド（Go）で構成。

---

## 📋 技術スタック

### フロントエンド (`frontend/`)

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript 5
- **ランタイム**: Node.js 25.0.0
- **パッケージマネージャー**: pnpm
- **スタイリング**: Tailwind CSS 4
- **リンター**: ESLint 9
- **テストフレームワーク**: Jest 29
- **ビルドツール**: Turbopack

### バックエンド (`backend/`)

- **言語**: Go 1.25.4
- **フレームワーク**: Gin (REST API)
- **ORM**: GORM
- **データベースドライバー**: MySQL, PostgreSQL, SQLite
- **ホットリロード**: Air
- **コード整形**: goimports

### インフラストラクチャ

- **コンテナ**: Docker
- **オーケストレーション**: Docker Compose 3.8
- **データベース**: MySQL 8.0
- **バージョン管理**: proto

---

## 📂 ディレクトリ構成

```
simple-ledger/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD設定
├── frontend/                    # Next.js フロントエンド
│   ├── app/                     # App Router (pages)
│   ├── public/                  # 静的ファイル
│   ├── eslint.config.mjs        # ESLint設定
│   ├── jest.config.js           # Jest設定
│   ├── next.config.ts           # Next.js設定
│   ├── tsconfig.json            # TypeScript設定
│   ├── postcss.config.mjs       # PostCSS設定
│   ├── package.json             # 依存関係
│   └── pnpm-lock.yaml           # ロックファイル
├── backend/                     # Go バックエンド
│   ├── cmd/server/main.go       # エントリーポイント
│   ├── go.mod                   # 依存関係
│   └── Dockerfile               # コンテナイメージ
├── .vscode/
│   └── settings.json            # VS Code設定
├── .copilot/
│   └── context/
│       └── coding_rules.md      # このファイル
├── docker-compose.yml           # Docker構成
├── .proto-tools.toml            # protoバージョン設定
├── .gitignore                   # Git除外設定
└── README.md                    # プロジェクトドキュメント
```

---

## 🔧 セットアップ

詳細な手順は [README.md のセットアップ手順](../README.md#セットアップ手順) を参照してください。

主なコマンド：

- `proto install` - バージョン設定
- `pnpm install` - フロントエンド依存関係
- `go mod download` - バックエンド依存関係
- `pnpm dev` / `air` - ローカル開発実行
- `docker-compose up --build -d` - Docker での実行

---

## 📝 コーディング規約

### フロントエンド (TypeScript/React)

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
- **API クライアント層の共通化**:

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
  - **例** (ログイン):

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

- **コンポーネント管理**:
  - **shadcn/ui**: `frontend/components/shadcn/ui/` に配置（Figma Make 生成コンポーネント含む）
  - **拡張 UI コンポーネント**: `frontend/components/ui/` に配置（shadcn/ui を拡張・カスタマイズしたコンポーネント）
  - **機能コンポーネント**: `frontend/components/features/{feature}/` に配置（業務ロジックを含むコンポーネント）
  - **インポート**: `@/components/` エイリアスを使用（パス解決は `tsconfig.json` の `"@/*": ["./*"]` で設定）
  - **コンポーネント再利用**: 新規コンポーネント作成時は既存の shadcn/ui or `components/ui` コンポーネントを活用
  - **階層構造**: `shadcn/ui` ← `ui/` ← `features/` の依存方向を保つ（逆方向の依存は避ける）

### バックエンド (Go)

- **言語**: Go 1.25.4
- **パッケージ管理**: go mod
- **コード整形**: goimports（保存時自動）
- **Linter**: golangci-lint（errcheck でエラーハンドリング検査）
  - エラーの戻り値を常にチェック（`if err != nil { ... }` 必須）
  - 未使用の変数・インポートを検査
- **フレームワーク**: Gin REST API
- **ORM**: GORM (MySQL/PostgreSQL/SQLite 対応)
- **認証**: JWT (github.com/golang-jwt/jwt/v5)
- **パスワード**: bcrypt (golang.org/x/crypto/bcrypt)
- **テスト**: go test で実行（`go test -v -race -coverprofile=coverage.out ./...`）
- **Auto Format**: [backend/.air.toml](../backend/.air.toml) で goimports 自動実行

### 環境変数設定

バックエンドは `.env` ファイルで環境変数を管理：

```
# JWT 設定
JWT_SECRET=development-secret-key-change-in-production
TOKEN_EXPIRATION_HOURS=1
REFRESH_TOKEN_EXPIRATION_HOURS=1

# アプリケーション
APP_ENV=development
PORT=8080

# データベース
DB_HOST=mysql
DB_PORT=3306
DB_NAME=myapp
DB_USER=root
DB_PASSWORD=password
```

- `APP_ENV=production` で本番環境
- 開発環境では自動的にシードデータを投入
- 環境変数は `config.GetEnv()`, `config.GetEnvAsInt()` で取得

---

## 🚀 CI/CD

GitHub Actions で自動的に以下を実行：

**フロントエンド:**

- ESLint チェック
- Next.js ビルド確認
- Jest テスト実行

**バックエンド:**

- go vet チェック
- golangci-lint チェック
- go test 実行

詳細は [README.md の CI/CD セクション](../README.md#cicd) を参照してください。

---

## 🔗 その他の情報

- **開発手順**: [README.md の開発セクション](../README.md#開発)
- **Docker コマンド**: [README.md の Docker コマンド](../README.md#docker-コマンド)
- **トラブルシューティング**: [README.md](../README.md#トラブルシューティング)

---

## �️ コード生成時のガイドライン

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

### バックエンド

1. **エラーハンドリング（必須）**

   - すべての戻り値のエラーをチェック（golangci-lint の errcheck で検査）
   - エラーハンドリングの基本パターン：

   ```go
   // ❌ 悪い例：エラーを無視
   db.AutoMigrate(&models.User{})
   service.userRepo.CreateUser(user)

   // ✅ 良い例：エラーをチェック
   if err := db.AutoMigrate(&models.User{}); err != nil {
       return fmt.Errorf("migration failed: %w", err)
   }
   if err := service.userRepo.CreateUser(user); err != nil {
       return fmt.Errorf("create user failed: %w", err)
   }

   // ✅ テストコードでエラーを無視する場合は明示
   _ = db.AutoMigrate(&models.User{})
   _ = service.userRepo.CreateUser(user)
   ```

   - エラーがない場合も `_ =` で明示的に無視
   - `json.Unmarshal`, `json.Marshal` などの API も同様にチェック
   - テストコード内でも同じルールを適用

2. **関数の戻り値**

   - 戻り値がある関数は必ずハンドリング
   - 複数の戻り値がある場合は全てをチェック（例：`*User, error`）
   - テストコードでも無視するなら `_, _ =` で明示
   - golangci-lint の `errcheck` ルールを遵守
   - 例: `if err != nil { return err }` を忘れずに

3. **命名規則**

   - エクスポート関数: PascalCase
   - プライベート関数: camelCase
   - 定数: UPPER_SNAKE_CASE

4. **goimports 対応**

   - インポートは自動フォーマットで整理（`.air.toml` で実行）
   - 不要なインポートは記述しない

5. **JSON レスポンス形式**

   - struct タグのキャメルケース必須（React フロントエンドとの互換性）
   - 例: `json:"createdAt"`, `json:"lastLoginAt"`, `json:"isActive"`
   - 隠す必要があるフィールドは `json:"-"` を使用

6. **CRUD 実装パターン（User モデルに従う）**

   - **ディレクトリ構造**: `internal/{entity}/`

     - `controller/` - HTTP ハンドラ
     - `service/` - ビジネスロジック
     - `repository/` - DB 操作（GORM）
     - `dto/` - リクエスト/レスポンス DTO
     - `router/` - エンドポイント定義

   - **モデル定義** (`internal/models/`)

     - GORM タグで型とバリデーション指定: `gorm:"type:varchar(255)"`
     - JSON タグはキャメルケース: `json:"createdAt"`
     - パスワードなどの隠すフィールド: `json:"-"`

   - **DTO パターン**

     - `CreateXxxRequest`: 作成時の必須フィールド、バリデーション付き
     - `UpdateXxxRequest`: 更新時の必須フィールド + 任意フィールド（ポインタ型）
     - `XxxResponse`: JSON レスポンス用（パスワード等機密情報は除外）

   - **Service 層パターン**

     - エラーはエラーハンドリング（panic 不使用）
     - パスワードハッシュ化は Service 層で実行
     - ビジネスロジック（重複チェック等）は Service に集約

   - **Repository 層パターン**

     - GORM 操作をカプセル化
     - エラー処理を含める（`if err != nil { return nil, err }`）

   - **Controller 層パターン**

     - `ShouldBindJSON` でリクエスト検証
     - HTTP ステータスコードを正確に返す（201: Created, 400: Bad Request など）
     - エラーレスポンスは `gin.H{"error": err.Error()}`

   - **Router パターン**
     - `router/router.go` で全ルート定義
     - `SetupXxxRoutes(engine *gin.Engine, db *gorm.DB)` で初期化
     - main.go から呼び出す

7. **JWT 認証パターン（Auth パッケージに従う）**

   - **認証方式**: ステートレス JWT 認証

     - トークンはデータベースに保存しない
     - 署名検証はメモリ上で実行（署名鍵で検証）
     - スケーラビリティが高く、複数サーバーに対応

   - **ディレクトリ構造**: `internal/auth/`

     - `controller/` - ログイン・トークン更新エンドポイント
     - `service/` - ユーザー認証・トークン生成ロジック
     - `dto/` - LoginRequest, LoginResponse など
     - `middleware/` - JWT 検証ミドルウェア
     - `router/` - 認証ルート定義

   - **セキュリティ パッケージ** (`internal/common/security/`)

     - `jwt.go`:
       - `InitJWT(secret string, tokenExpirationHours int, refreshTokenExpirationHours int)` - 初期化（main.go で呼び出す）
       - `GenerateToken(userID uint, email string, role string, isActive bool)` - アクセストークン生成
       - `GenerateRefreshToken(userID uint, email string, role string, isActive bool)` - リフレッシュトークン生成
       - `VerifyToken(tokenString string) (*CustomClaims, error)` - トークン検証（署名検証 + 有効期限チェック）
       - `GetTokenExpirationSeconds()`, `GetRefreshTokenExpirationSeconds()` - 現在の設定値取得
     - `password.go`:
       - `HashPassword(password string) (string, error)` - bcrypt ハッシング
       - `VerifyPassword(hashedPassword string, password *string) bool` - パスワード検証

   - **DTO パターン**

     - `LoginRequest`: email, password
     - `LoginResponse`: accessToken, refreshToken, expiresIn
     - `RefreshTokenRequest`: refreshToken

   - **Service 層パターン**

     - `Login()`: メールアドレスとパスワードで認証、トークン生成
     - `RefreshAccessToken()`: リフレッシュトークンでアクセストークン更新
     - ユーザー有効性チェック（IsActive）を実装

   - **Controller 層パターン**

     - POST `/api/auth/login` - HTTP 200、LoginResponse 返却（accessToken, refreshToken, expiresIn）
     - POST `/api/auth/refresh` - HTTP 200、新しい accessToken 返却
     - エラーは HTTP 401 (Unauthorized) で返す

   - **Middleware パターン**

     - `Authorization: Bearer <token>` ヘッダーを検証
     - `VerifyToken()` で署名検証と有効期限チェック
     - クレーム情報を gin.Context に格納（`ctx.Set("claims", claims)`）
     - 無効なトークンは HTTP 401 で拒否

   - **トークン管理**
     - トークンはクライアント側で保持（localStorage、cookie など）
     - サーバーはトークン検証時に署名のみチェック
     - データベースにはトークン保存なし（ステートレス設計）
     - ログアウト機能は必要に応じてトークンブラックリスト実装可

8. **テスト**
   - ユニットテストは `_test.go` ファイルに記述
   - `go test -v -race` で実行可能な状態を保つ
   - テストパターン:
     - Repository: GORM CRUD 確認
     - Service: ビジネスロジック + エラーケース確認
     - Controller: HTTP ステータス + JSON レスポンス確認
   - SQLite インメモリ DB を使用して高速化
   - **テスト初期化**: `InitJWT("test-secret", 1, 1)` でテスト用 JWT を初期化

---

## 💡 コード分析時のポイント

1. **フロントエンド分析**:

   - App Router（`app/` ディレクトリ内）を確認
   - TypeScript の型定義を優先
   - pnpm-lock.yaml は version control に含まれている

2. **バックエンド分析**:

   - **初期化順序** in main.go:
     1. 環境変数読み込み (`config.LoadEnv()`)
     2. DB 接続設定
     3. マイグレーション実行
     4. シードデータ投入（開発環境のみ）
     5. **JWT 初期化** (`security.InitJWT()` - 環境変数から有効期限を読み込み)
     6. ルート定義
   - Gin ルータの設定を確認
   - GORM モデルと複数 DB 対応を考慮
   - エラーハンドリングを確認（golangci-lint による検査）
   - User モデルの CRUD パターンに従う
   - **認証が必要なエンドポイント**: JWT Middleware を適用

3. **共通**:
   - Docker 環境での実行を念頭に、環境変数の設定を確認
   - フロントは pnpm、バックエンドは go mod を使用
   - 依存関係の再現性（ロックファイル）を重視
   - `.env` に機密情報を含めない（開発環境用デフォルト値のみ）

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

#### `theme/colors.ts` - カラーパレット定義（デジタル庁準拠）

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

### デザインシステム（カラーパレット）

⚠️ **重要**: デザインシステムの詳細は、上記「デザインシステム（デジタル庁準拠）」セクションを参照してください。
