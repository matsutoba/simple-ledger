# simple-ledger

個人事業主向けのシンプルな会計アプリケーション

## 技術スタック

- **Frontend**: Next.js 15 (TypeScript, Tailwind CSS)
- **Backend**: Go (Golang) 1.23
- **Database**: MySQL 8.0
- **コンテナ**: Docker & Docker Compose

## プロジェクト構成

```
simple-ledger/
├── frontend/          # Next.jsフロントエンドアプリケーション
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
├── backend/           # Golangバックエンドアプリケーション
│   ├── main.go
│   ├── go.mod
│   ├── go.sum
│   └── Dockerfile
└── docker-compose.yml # Docker Compose設定
```

## セットアップ

### 前提条件

- Docker Desktop がインストールされていること
- Docker Compose が利用可能であること

### インストール手順

1. リポジトリをクローン:

```bash
git clone https://github.com/matsutoba/simple-ledger.git
cd simple-ledger
```

2. Docker Composeでアプリケーションを起動:

```bash
docker-compose up -d
```

初回起動時は、イメージのビルドに数分かかります。

3. アプリケーションへアクセス:

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:8080
- データベース: localhost:3306

### 停止方法

```bash
docker-compose down
```

データベースのデータも削除する場合:

```bash
docker-compose down -v
```

## 開発

### ローカル開発環境

#### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

http://localhost:3000 でアクセス可能

#### バックエンド

```bash
cd backend
go run main.go
```

http://localhost:8080 でアクセス可能

### API エンドポイント

- `GET /api/health` - ヘルスチェック
- `GET /api/transactions` - 取引一覧の取得

## データベース

### スキーマ

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

### 接続情報

- ホスト: localhost
- ポート: 3306
- データベース名: ledger
- ユーザー: root
- パスワード: password

## ライセンス

MIT
