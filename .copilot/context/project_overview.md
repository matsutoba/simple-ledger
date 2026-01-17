# simple-ledger プロジェクト概要

## 🎯 プロジェクト説明

シンプルな会計アプリケーション。フロントエンド（Next.js）とバックエンド（Go）で構成。

---

## 📋 技術スタック

### フロントエンド (`frontend/`)

- **フレームワーク**: Next.js 16 (App Router)
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
│       ├── project_overview.md      # プロジェクト概要
│       ├── frontend_coding_rules.md # フロントエンドルール
│       └── backend_coding_rules.md  # バックエンドルール
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
- **フロントエンドコーディングルール**: [frontend_coding_rules.md](frontend_coding_rules.md)
- **バックエンドコーディングルール**: [backend_coding_rules.md](backend_coding_rules.md)
