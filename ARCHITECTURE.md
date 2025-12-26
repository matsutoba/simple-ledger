# システムアーキテクチャ

## 全体構成図

```
┌─────────────────────────────────────────────────────────────┐
│                     Docker Environment                       │
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌───────────┐  │
│  │              │      │              │      │           │  │
│  │  Frontend    │─────▶│  Backend     │─────▶│  MySQL    │  │
│  │  (Next.js)   │      │  (Golang)    │      │  Database │  │
│  │              │      │              │      │           │  │
│  │  Port: 3000  │      │  Port: 8080  │      │ Port:3306 │  │
│  └──────────────┘      └──────────────┘      └───────────┘  │
│         │                     │                     │        │
│         └─────────────────────┴─────────────────────┘        │
│                    ledger-network (bridge)                   │
│                                                               │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
                          ┌──────────┐
                          │  User    │
                          │ Browser  │
                          └──────────┘
```

## データフロー

### 1. ユーザーアクセス

```
Browser ──HTTP GET──▶ http://localhost:3000
                      │
                      ▼
                  Next.js Frontend
                      │
                  ページ表示
```

### 2. API呼び出し

```
Next.js Frontend ──HTTP GET──▶ http://localhost:8080/api/health
                               │
                               ▼
                          Golang Backend
                               │
                               ├─ ルーティング (Gorilla Mux)
                               ├─ CORS処理
                               └─ データベースクエリ
                                  │
                                  ▼
                            MySQL Database
                                  │
                                  ▼
                            JSON Response
```

### 3. データベース初期化

```
Backend起動
   │
   ├─ 最大30回リトライでDB接続
   │
   ├─ 接続成功
   │
   └─ テーブル自動作成
      │
      └─ transactions テーブル
```

## コンポーネント詳細

### フロントエンド (Next.js)

**責務:**
- ユーザーインターフェース
- ページルーティング
- APIクライアント
- レスポンシブデザイン

**技術:**
- React Server Components
- Tailwind CSS
- TypeScript

### バックエンド (Golang)

**責務:**
- RESTful API提供
- ビジネスロジック
- データベース操作
- CORS処理

**主要パッケージ:**
- `gorilla/mux`: ルーティング
- `go-sql-driver/mysql`: MySQL接続
- `rs/cors`: CORS対応

### データベース (MySQL)

**責務:**
- データ永続化
- トランザクション管理
- データ整合性保証

**特徴:**
- MySQL 8.0の最新機能
- 自動バックアップ対応（ボリューム）
- ヘルスチェック機能

## 環境変数

### Frontend

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Backend

```bash
DB_USER=root
DB_PASSWORD=password
DB_HOST=db
DB_PORT=3306
DB_NAME=ledger
PORT=8080
```

### Database

```bash
MYSQL_ROOT_PASSWORD=password
MYSQL_DATABASE=ledger
MYSQL_USER=ledger_user
MYSQL_PASSWORD=ledger_pass
```

## セキュリティ考慮事項

1. **本番環境での注意点:**
   - 環境変数のパスワードを変更する
   - HTTPS/TLSを有効にする
   - 適切なCORS設定を行う
   - データベースポートを外部公開しない

2. **推奨事項:**
   - Docker Secretsの使用
   - 環境変数ファイルを.gitignoreに追加
   - アクセスログの記録
   - 定期的なバックアップ

## パフォーマンス

### Next.js最適化

- Standalone出力モード
- 自動的な静的最適化
- イメージ最適化

### Golang最適化

- マルチステージビルド
- 軽量Alpine Linuxベース
- コンパイル済みバイナリ

### データベース最適化

- 接続プーリング
- インデックス設定
- クエリ最適化の余地あり
