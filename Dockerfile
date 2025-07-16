# Node.js環境
FROM node:18-alpine AS base

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm ci --only=production

# 開発環境の場合は開発用依存関係もインストール
FROM base AS dev
RUN npm ci

# アプリケーションコードをコピー
COPY . .

# Prisma Clientを生成
RUN npx prisma generate

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "dev"]