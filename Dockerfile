# Node.js環境（最新の安全なバージョン）
FROM node:20-alpine

# 作業ディレクトリを設定
WORKDIR /app

# package.jsonとpackage-lock.jsonをコピー
COPY package*.json ./

# Prismaスキーマをコピー（postinstallで必要）
COPY prisma ./prisma

# 依存関係をインストール（この時点でprisma generateが実行される）
RUN npm ci

# 残りのアプリケーションコードをコピー
COPY . .

# ユーザー作成＆権限
RUN addgroup -S nodejs \
 && adduser -S nextjs -G nodejs \
 && chown -R nextjs:nodejs /app

# init スクリプトを入れて実行権限を付与
COPY scripts/init-app.sh /usr/local/bin/init-app.sh
RUN chmod +x /usr/local/bin/init-app.sh

# 非rootユーザーに切り替え
USER nextjs

# ポートを公開
EXPOSE 3000

# アプリケーションを起動
ENTRYPOINT ["/usr/local/bin/init-app.sh"]
CMD ["npm", "run", "dev", "-H", "0.0.0.0"]