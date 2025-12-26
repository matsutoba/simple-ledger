# simple-ledger

シンプルな家計簿アプリケーション

## 技術スタック

### フロントエンド

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **ビルドツール**: Turbopack
- **コード整形**: Prettier
- **ノード**: Node.js 25.0.0

### バックエンド

- **言語**: Go 1.25.4
- **フレームワーク**: Gin
- **ORM**: GORM
- **データベースドライバー**: MySQL, PostgreSQL, SQLite
- **ホットリロード**: Air
- **コード整形**: goimports

### インフラ

- **コンテナ**: Docker
- **オーケストレーション**: Docker Compose
- **バージョン管理**: proto

## セットアップ手順

### 前提条件

- [proto](https://moonrepo.dev/docs/proto) がインストール済み
- Docker がインストール済み

### 1. proto でバージョン設定

プロジェクトディレクトリで以下を実行して、Go と Node.js のバージョンを自動設定します：

```bash
proto install
```

### 2. 依存関係のインストール

#### フロントエンド

```bash
cd frontend
pnpm install
cd ..
```

#### バックエンド

```bash
cd backend
go mod download
cd ..
```

### 3. Docker で環境構築

```bash
docker-compose up --build -d
```

これにより以下が起動します：

- **フロントエンド（Next.js）**: ポート 80（本番ビルド）
- **バックエンド（Gin）**: ポート 8080

## 開発

### フロントエンド開発

ローカル開発環境で実行：

```bash
cd frontend
pnpm install
pnpm dev
```

- ブラウザで http://localhost:3000 にアクセス
- ホットリロード有効

### バックエンド開発

ローカル開発環境で実行：

```bash
cd backend
go mod download
air
```

- API は http://localhost:8080 で利用可能
- Air がコード変更を自動検知してホットリロード

## Docker コマンド

### コンテナの起動

```bash
docker-compose up --build -d
```

### ログ確認

```bash
docker-compose logs -f
```

### コンテナの停止

```bash
docker-compose down
```

## コード整形

保存時に自動的にフォーマットされます：

- **Go**: goimports で自動整形
- **TypeScript/JavaScript**: Prettier で自動整形

詳細は `.vscode/settings.json` を参照

## ディレクトリ構成

```
.
├── frontend/          # Next.js フロントエンド
├── backend/           # Go バックエンド
├── docker-compose.yml # Docker Compose 設定
├── .proto-tools.toml  # proto バージョン管理
├── .gitignore         # Git 無視ファイル設定
└── README.md          # このファイル
```

## トラブルシューティング

### Golang コンテナが終了する

- `.air.toml` が正しく存在するか確認
- `go mod download` が実行されているか確認

### Node のバージョンが異なる

- `proto install` を実行して正しいバージョンを設定

## ライセンス

MIT
