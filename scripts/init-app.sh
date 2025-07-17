#!/bin/sh
set -e

# .nextの作成
mkdir -p /app/.next
chown -R nextjs:nodejs /app/.next

# DBセットアップ
npm run db:setup

# メインプロセスの実行
exec "$@"