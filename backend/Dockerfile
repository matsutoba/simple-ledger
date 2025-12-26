FROM golang:1.25.4-alpine

WORKDIR /app

# Air（ホットリロードツール）をインストール
RUN go install github.com/air-verse/air@latest

# ソースコードをコピー
COPY . .

# 依存関係をダウンロード
COPY go.mod go.sum ./
RUN go mod download

# ポート8080を公開
EXPOSE 8080

# Airを使ってホットリロード実行
CMD ["air", "-c", ".air.toml"]