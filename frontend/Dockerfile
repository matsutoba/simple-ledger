FROM node:25-alpine

WORKDIR /app

# pnpmをインストール
RUN npm install -g pnpm

# package.json と pnpm-lock.yaml をコピー
COPY package.json pnpm-lock.yaml ./

# 依存関係をインストール
RUN pnpm install --frozen-lockfile

# アプリケーションコードをコピー
COPY . .

EXPOSE 80

ENV PORT=80
ENV HOSTNAME="0.0.0.0"

# npm run dev コマンドを実行
CMD ["npm", "run", "dev"]
