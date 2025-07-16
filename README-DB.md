# データベース自動初期化設定

新規 PostgreSQL サーバーを立ち上げた際に自動でデータベースにデータを投入する設定が完了しています。

## 利用可能なコマンド

### 基本コマンド

```bash
# データベース全体の初期化（マイグレーション + シード）
npm run db:setup

# マイグレーション実行
npm run db:migrate

# シードデータ投入
npm run db:seed

# データベースリセット（全データ削除 + 再作成）
npm run db:reset

# データベース状態確認
npm run db:check
```

## Docker 使用時の自動初期化

### docker-compose 使用

```bash
# PostgreSQLサーバーとアプリケーションを同時起動
docker-compose up

# バックグラウンドで起動
docker-compose up -d
```

Docker 起動時に以下が自動実行されます：

1. PostgreSQL サーバー起動
2. データベース作成
3. マイグレーション実行
4. シードデータ投入
5. アプリケーション起動

### 手動でのデータベース初期化

```bash
# PostgreSQLサーバーのみ起動
docker-compose up db

# 別ターミナルでデータベース初期化
npm run db:setup

# アプリケーション起動
npm run dev
```

## 環境変数設定

`.env`ファイルに以下の環境変数を設定してください：

```env
DATABASE_URL="postgresql://user:postgres@localhost:5432/timetable_dev"
```

## トラブルシューティング

### データベース接続エラー

```bash
# データベースの状態確認
npm run db:check

# PostgreSQLサーバーの状態確認
docker-compose ps

# ログ確認
docker-compose logs db
```

### データが入っていない場合

```bash
# シードデータの再投入
npm run db:seed

# 完全リセット
npm run db:reset
```

### マイグレーション関連のエラー

```bash
# マイグレーション状態確認
npx prisma migrate status

# マイグレーションリセット
npx prisma migrate reset

# 新しいマイグレーション作成
npx prisma migrate dev --name init
```

## ファイル構成

```
scripts/
├── db-setup.js       # データベース初期化スクリプト
├── check-db.js       # データベース状態確認スクリプト
├── init-db.sql       # Docker用初期化SQLファイル
└── ts-node.json      # TypeScript実行設定

docker-compose.yml     # Docker設定
Dockerfile            # Dockerイメージ設定
```

## 注意事項

- 本番環境では適切なパスワードとセキュリティ設定を使用してください
- シードデータは開発用のサンプルデータです
- データベースの完全リセットは既存データを削除します
