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
- **ビルドツール**: Turbopack
- **セットアップ**: `pnpm install` / `pnpm dev` / `pnpm build`

### バックエンド (`backend/`)

- **言語**: Go 1.25.4
- **フレームワーク**: Gin (REST API)
- **ORM**: GORM
- **データベースドライバー**: MySQL, PostgreSQL, SQLite
- **ホットリロード**: Air
- **コード整形**: goimports
- **セットアップ**: `go mod download` / `air`

### インフラストラクチャ

- **コンテナ**: Docker
- **オーケストレーション**: Docker Compose 3.8
- **データベース**: MySQL 8.0
- **バージョン管理**: proto (Go 1.25.4, Node.js 25.0.0)

---

## 📂 ディレクトリ構成

```
simple-ledger/
├── frontend/                    # Next.js フロントエンド
│   ├── app/                     # App Router (pages)
│   ├── public/                  # 静的ファイル
│   ├── eslint.config.mjs        # ESLint設定
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

## 🔧 開発環境セットアップ

### 1. 前提条件

- proto インストール
- Docker インストール
- Node.js / Go は proto で自動管理

### 2. バージョン設定

```bash
proto install
```

### 3. 依存関係インストール

```bash
# フロントエンド
cd frontend && pnpm install && cd ..

# バックエンド
cd backend && go mod download && cd ..
```

### 4. ローカル開発実行

```bash
# フロントエンド（別ターミナル）
cd frontend && pnpm dev

# バックエンド（別ターミナル）
cd backend && air
```

### 5. Docker での実行

```bash
docker-compose up --build -d
```

---

## 📝 コーディング規約

### フロントエンド (TypeScript/React)

- **言語**: TypeScript（`strict: true`）
- **スタイル**: Tailwind CSS + App Router
- **ファイル命名**: kebab-case (`.tsx`, `.ts`)
- **フォーマット**: ESLint で自動整形（保存時）
- **パッケージマネージャー**: pnpm を使用

### バックエンド (Go)

- **言語**: Go 1.25.4
- **パッケージ管理**: go mod
- **コード整形**: goimports（保存時自動）
- **フレームワーク**: Gin REST API
- **ORM**: GORM (MySQL/PostgreSQL/SQLite 対応)

---

## 🔌 API エンドポイント

バックエンド: `http://localhost:8080`
フロントエンド開発: `http://localhost:3000`
フロントエンド本番（Docker）: `http://localhost:80`

---

## 📦 主要な依存関係

### フロントエンド (`package.json`)

- next@16.1.1
- react@19.2.3
- react-dom@19.2.3
- tailwindcss@4
- @tailwindcss/postcss@4
- typescript@5
- eslint@9

### バックエンド (`go.mod`)

- gin-gonic/gin@1.11.0
- gorm.io/gorm@1.31.1
- gorm.io/driver/\* (mysql, postgres, sqlite)

---

## 💡 コード分析時のポイント

1. **フロントエンド分析**: App Router (pages in `app/`) を確認、TypeScript の型定義を優先
2. **バックエンド分析**: Gin ルータ, GORM モデルを確認、複数 DB 対応を考慮
3. **共通**: Docker 環境での実行を念頭に、環境変数の設定を確認
4. **パッケージ管理**: フロントは pnpm、バックエンドは go mod を使用
