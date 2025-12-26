#!/bin/bash

# シンプル会計帳簿 - セットアップ検証スクリプト

echo "🔍 プロジェクト構造を確認しています..."
echo ""

# ディレクトリ構造の確認
if [ -d "frontend" ] && [ -d "backend" ]; then
    echo "✅ frontend および backend ディレクトリが存在します"
else
    echo "❌ frontend または backend ディレクトリが見つかりません"
    exit 1
fi

# Dockerファイルの確認
if [ -f "docker-compose.yml" ] && [ -f "frontend/Dockerfile" ] && [ -f "backend/Dockerfile" ]; then
    echo "✅ Docker設定ファイルが揃っています"
else
    echo "❌ Docker設定ファイルが不足しています"
    exit 1
fi

# フロントエンド設定の確認
if [ -f "frontend/package.json" ] && [ -f "frontend/next.config.ts" ]; then
    echo "✅ Next.js設定が存在します"
else
    echo "❌ Next.js設定が見つかりません"
    exit 1
fi

# バックエンド設定の確認
if [ -f "backend/go.mod" ] && [ -f "backend/main.go" ]; then
    echo "✅ Golang設定が存在します"
else
    echo "❌ Golang設定が見つかりません"
    exit 1
fi

echo ""
echo "✨ すべての必要なファイルが揃っています！"
echo ""
echo "📝 次のステップ:"
echo "   1. docker compose up -d を実行してください"
echo "   2. http://localhost:3000 でフロントエンドにアクセス"
echo "   3. http://localhost:8080/api/health でバックエンドAPIを確認"
echo ""
