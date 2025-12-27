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

### バックエンド (Go)

- **言語**: Go 1.25.4
- **パッケージ管理**: go mod
- **コード整形**: goimports（保存時自動）
- **Linter**: golangci-lint（errcheck でエラーハンドリング検査）
  - エラーの戻り値を常にチェック（`if err != nil { ... }` 必須）
  - 未使用の変数・インポートを検査
- **フレームワーク**: Gin REST API
- **ORM**: GORM (MySQL/PostgreSQL/SQLite 対応)
- **テスト**: go test で実行（`go test -v -race -coverprofile=coverage.out ./...`）
- **Auto Format**: [backend/.air.toml](../backend/.air.toml) で goimports 自動実行

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

   - 設定ファイル: [.air.toml](../backend/.air.toml)
   - すべての関数呼び出しのエラーをチェック
   - golangci-lint の `errcheck` ルールを遵守
   - 例: `if err != nil { return err }` を忘れずに

2. **命名規則**

   - エクスポート関数: PascalCase
   - プライベート関数: camelCase
   - 定数: UPPER_SNAKE_CASE

3. **goimports 対応**

   - インポートは自動フォーマットで整理（`.air.toml` で実行）
   - 不要なインポートは記述しない

4. **JSON レスポンス形式**

   - struct タグのキャメルケース必須（React フロントエンドとの互換性）
   - 例: `json:"createdAt"`, `json:"lastLoginAt"`, `json:"isActive"`
   - 隠す必要があるフィールドは `json:"-"` を使用

5. **テスト**
   - ユニットテストは `_test.go` ファイルに記述
   - `go test -v -race` で実行可能な状態を保つ

---

## �💡 コード分析時のポイント

1. **フロントエンド分析**:

   - App Router（`app/` ディレクトリ内）を確認
   - TypeScript の型定義を優先
   - pnpm-lock.yaml は version control に含まれている

2. **バックエンド分析**:

   - Gin ルータの設定を確認
   - GORM モデルと複数 DB 対応を考慮
   - エラーハンドリングを確認（golangci-lint による検査）

3. **共通**:
   - Docker 環境での実行を念頭に、環境変数の設定を確認
   - フロントは pnpm、バックエンドは go mod を使用
   - 依存関係の再現性（ロックファイル）を重視
