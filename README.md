# simple-ledger

シンプルな家計簿アプリケーション。モダンな技術スタックを使用した、フルスタック Web アプリケーションです。

## 📋 プロジェクト概要

フロントエンドと REST API バックエンドで構成された、スケーラブルなウェブアプリケーションです。
ユーザー認証、ユーザー管理機能を実装し、本番環境での運用を想定した設計になっています。

### 実装済み機能

- ✅ **ユーザー認証**: JWT ベースのステートレス認証
- ✅ **ユーザー管理**: CRUD 操作（作成・参照・更新・削除）
- ✅ **自動テストデータ投入**: 開発環境での初期データ自動生成
- ✅ **複数データベース対応**: MySQL / PostgreSQL / SQLite に対応

## 🛠️ 技術スタック

| レイヤー | 技術 |
|---------|------|
| **フロントエンド** | Next.js 15, TypeScript, Tailwind CSS |
| **バックエンド** | Go 1.25.4, Gin Framework, GORM |
| **認証** | JWT (ステートレス認証), bcrypt (パスワード管理) |
| **インフラ** | Docker, Docker Compose |
| **開発ツール** | proto (バージョン管理), Air (ホットリロード) |

## 🏗️ アーキテクチャ

### バックエンド設計

**レイヤー構造**:
- **Controller**: HTTP リクエスト/レスポンス処理
- **Service**: ビジネスロジック実装
- **Repository**: データベース操作の抽象化
- **DTO**: リクエスト/レスポンス検証

**認証方式**: ステートレス JWT 認証
- トークンはクライアント側で保持
- サーバーは署名検証のみを実行（DB 参照不要）
- 水平スケーリングに対応

### データベーススキーマ

User テーブル（認証・ユーザー管理用）

```
- id: 主キー
- email: ユニークキー
- name: ユーザー名
- password: bcrypt ハッシュ
- role: admin / user
- is_active: ユーザーステータス
- last_login_at: ログイン追跡用
- timestamps: 作成/更新日時
```

## 🚀 クイックスタート

### 前提条件

- Docker がインストール済み
- proto がインストール済み

### セットアップ

```bash
# バージョン設定
proto install

# コンテナ起動
docker-compose up --build -d
```

### アクセス

- **フロントエンド**: http://localhost
- **バックエンド API**: http://localhost:8080

## 📊 API 概要

| エンドポイント | メソッド | 説明 |
|---------------|---------|------|
| `/api/auth/login` | POST | ユーザーログイン |
| `/api/auth/refresh` | POST | トークン更新 |
| `/api/users` | GET | ユーザー一覧取得 |
| `/api/users` | POST | ユーザー作成 |
| `/api/users/:id` | GET | ユーザー詳細取得 |
| `/api/users/:id` | PATCH | ユーザー更新 |
| `/api/users/:id` | DELETE | ユーザー削除 |

認証が必要なエンドポイント（`/api/users/*`）には、`Authorization: Bearer <token>` ヘッダーが必須です。

## ✅ テスト

```bash
# フロントエンド
cd frontend && pnpm test

# バックエンド
cd backend && go test ./...
```

全レイヤー（Repository, Service, Controller）でユニットテストを実装しています。

## 🔄 CI/CD

GitHub Actions で自動化：
- フロントエンド: ESLint, ビルド, Jest テスト
- バックエンド: go vet, golangci-lint, go test

## 📁 ディレクトリ構成

```
simple-ledger/
├── frontend/           # Next.js フロントエンド
├── backend/            # Go REST API
├── docker-compose.yml  # インフラ設定
└── .copilot/           # 開発ガイドライン
```

詳細な開発ガイドは [.copilot/context/coding_rules.md](.copilot/context/coding_rules.md) を参照してください。

## 📝 コーディング規約

- **Go**: goimports で自動整形
- **TypeScript/JavaScript**: Prettier で自動整形
- **エラーハンドリング**: panic を使わない例外処理
- **テスト**: レイヤーごとの単体テスト実装

## 📄 ライセンス

MIT
