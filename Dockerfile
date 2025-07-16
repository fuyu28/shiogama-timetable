# Node.js環境（最新の安全なバージョン）
FROM node:20-alpine

# セキュリティ向上のため非rootユーザーを作成
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# 作業ディレクトリを設定
WORKDIR /app

# 作業ディレクトリの所有者を事前に設定
RUN chown nextjs:nodejs /app

# 非rootユーザーに切り替え
USER nextjs

# package.jsonとpackage-lock.jsonをコピー
COPY --chown=nextjs:nodejs package*.json ./

# Prismaスキーマをコピー（postinstallで必要）
COPY --chown=nextjs:nodejs prisma ./prisma

# 依存関係をインストール（この時点でprisma generateが実行される）
RUN npm ci

# 残りのアプリケーションコードをコピー
COPY --chown=nextjs:nodejs . .

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
CMD ["npm", "run", "dev"]