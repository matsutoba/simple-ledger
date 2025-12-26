FROM node:25-alpine

WORKDIR /app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションコードをコピー
COPY . .

EXPOSE 80

ENV PORT=80
ENV HOSTNAME="0.0.0.0"

# npm run dev コマンドを実行
CMD ["npm", "run", "dev"]
