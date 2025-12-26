# プロジェクト構成ガイド

このドキュメントでは、simple-ledgerプロジェクトの詳細な構成について説明します。

## ディレクトリ構造

```
simple-ledger/
├── frontend/              # Next.jsフロントエンドアプリケーション
│   ├── src/
│   │   └── app/
│   │       ├── page.tsx       # メインページ
│   │       ├── layout.tsx     # レイアウトコンポーネント
│   │       └── globals.css    # グローバルスタイル
│   ├── public/                # 静的ファイル
│   ├── Dockerfile             # フロントエンド用Dockerfile
│   ├── package.json           # Node.js依存関係
│   ├── next.config.ts         # Next.js設定
│   ├── tsconfig.json          # TypeScript設定
│   └── .env.example           # 環境変数の例
│
├── backend/               # Golangバックエンドアプリケーション
│   ├── main.go               # メインAPIサーバー
│   ├── go.mod                # Go依存関係
│   ├── go.sum                # Go依存関係チェックサム
│   ├── Dockerfile            # バックエンド用Dockerfile
│   └── .env.example          # 環境変数の例
│
├── docker-compose.yml     # Docker Compose設定
├── verify-setup.sh        # セットアップ検証スクリプト
├── README.md              # プロジェクト説明
└── .gitignore             # Git除外設定
```

## 技術スタック詳細

### フロントエンド (frontend/)

- **フレームワーク**: Next.js 15 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **ビルドツール**: Turbopack
- **ポート**: 3000

#### 主要ファイル

- `src/app/page.tsx`: アプリケーションのホームページ
- `src/app/layout.tsx`: 全ページ共通のレイアウト
- `next.config.ts`: Next.jsの設定（standalone出力を有効化）
- `Dockerfile`: マルチステージビルドでイメージサイズを最適化

### バックエンド (backend/)

- **言語**: Go 1.23
- **フレームワーク**: 標準ライブラリ + Gorilla Mux
- **データベースドライバー**: go-sql-driver/mysql
- **CORS**: rs/cors
- **ポート**: 8080

#### APIエンドポイント

- `GET /api/health`: ヘルスチェック（DB接続状態を含む）
- `GET /api/transactions`: 取引一覧の取得

#### データベーススキーマ

```sql
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    type ENUM('income', 'expense') NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### データベース

- **RDBMS**: MySQL 8.0
- **データベース名**: ledger
- **ポート**: 3306
- **認証情報**: 
  - Root パスワード: password
  - ユーザー: ledger_user
  - パスワード: ledger_pass

## Docker構成

### コンテナ

1. **ledger-db**: MySQL 8.0データベース
   - ヘルスチェック機能付き
   - データ永続化ボリューム

2. **ledger-backend**: Golangバックエンド
   - マルチステージビルド（Alpine Linux）
   - DBヘルスチェック後に起動

3. **ledger-frontend**: Next.jsフロントエンド
   - マルチステージビルド（Node Alpine）
   - standalone出力で最適化

### ネットワーク

すべてのコンテナは `ledger-network` ブリッジネットワークで接続されています。

## セットアップ手順

### 前提条件

- Docker Desktop 20.10以上
- Docker Compose V2

### 起動

```bash
# プロジェクトディレクトリに移動
cd simple-ledger

# 検証スクリプトを実行（オプション）
./verify-setup.sh

# すべてのサービスを起動
docker compose up -d

# ログを確認
docker compose logs -f

# 状態を確認
docker compose ps
```

### アクセス

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8080/api/health
- MySQL: localhost:3306

### 停止

```bash
# サービスを停止
docker compose down

# データベースボリュームも削除する場合
docker compose down -v
```

## 開発モード

### フロントエンド開発

```bash
cd frontend
npm install
npm run dev
```

開発サーバーが http://localhost:3000 で起動します。

### バックエンド開発

```bash
cd backend
go run main.go
```

APIサーバーが http://localhost:8080 で起動します。

**注意**: 開発モードではMySQLは別途起動が必要です：

```bash
docker compose up -d db
```

## トラブルシューティング

### ポートが使用中

```bash
# ポート使用状況を確認
lsof -i :3000
lsof -i :8080
lsof -i :3306

# または Docker内のサービスを停止
docker compose down
```

### データベース接続エラー

```bash
# データベースコンテナのログを確認
docker compose logs db

# データベースのヘルスチェック
docker compose ps
```

### ビルドエラー

```bash
# キャッシュをクリアして再ビルド
docker compose build --no-cache

# 個別サービスの再ビルド
docker compose build backend
docker compose build frontend
```

## 今後の拡張

- [ ] ユーザー認証機能
- [ ] 取引の作成・編集・削除API
- [ ] レポート生成機能
- [ ] データエクスポート機能
- [ ] 複数通貨対応
- [ ] テスト環境の構築

## ライセンス

MIT
