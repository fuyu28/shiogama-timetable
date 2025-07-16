# Vercel デプロイ & BaaS 接続ガイド

VercelにデプロイしてBaaS（Backend as a Service）に接続する際の設定方法と、年1回のデータ更新を自動化する方法を説明します。

## 1. BaaS プロバイダーの選択

### おすすめのBaaS（PostgreSQL対応）

1. **Supabase** (推奨)
   - PostgreSQL完全互換
   - 無料枠が豊富
   - Prismaとの相性が良い

2. **Neon**
   - PostgreSQL専用
   - サーバーレス対応
   - 無料枠あり

3. **PlanetScale**
   - MySQL互換（Prisma設定要変更）
   - 無料枠あり

4. **Railway**
   - PostgreSQL対応
   - 無料枠あり

## 2. Vercelデプロイ設定

### 2.1 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定：

```env
# データベース接続URL（BaaSプロバイダーから取得）
DATABASE_URL=postgresql://username:password@host:port/database

# 管理者用シークレットキー（自分で生成）
ADMIN_SECRET=your-super-secret-key-here

# Vercel URL（自動設定される）
VERCEL_URL=https://your-app.vercel.app
```

### 2.2 デプロイ設定

`vercel.json`が既に作成されているので、以下のコマンドでデプロイ：

```bash
# Vercel CLIインストール
npm install -g vercel

# デプロイ
vercel

# 本番環境にデプロイ
vercel --prod
```

## 3. BaaS接続手順

### 3.1 Supabaseを使用する場合

1. [Supabase](https://supabase.com)でプロジェクト作成
2. Settings → Database → Connection stringを取得
3. `DATABASE_URL`に設定

```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres
```

### 3.2 Neonを使用する場合

1. [Neon](https://neon.tech)でプロジェクト作成
2. Connection stringを取得
3. `DATABASE_URL`に設定

```env
DATABASE_URL=postgresql://username:password@ep-[ID].region.neon.tech/database
```

## 4. 初回デプロイ時のデータベース設定

### 4.1 自動初期化

Vercelデプロイ時に`vercel-build`スクリプトが自動実行され、以下が行われます：

1. Prisma Client生成
2. データベーススキーマ作成（`prisma db push`）
3. Next.jsビルド

### 4.2 手動でのシードデータ投入

デプロイ後、以下のAPIを叩いてシードデータを投入：

```bash
# 初回データ投入
curl -X POST https://your-app.vercel.app/api/admin/seed \
  -H "Authorization: Bearer your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"action": "reset"}'
```

## 5. 年1回の自動データ更新

### 5.1 GitHub Actionsの設定

`.github/workflows/update-timetable.yml`が作成済み。以下の設定が必要：

#### GitHub Secretsの設定

リポジトリのSettings → Secrets and variables → Actionsで設定：

```
ADMIN_SECRET: your-super-secret-key-here
VERCEL_URL: https://your-app.vercel.app
```

#### 実行スケジュール

- **自動実行**: 毎年3月1日午前2時（日本時間）
- **手動実行**: GitHub Actionsページから実行可能

### 5.2 データ更新の流れ

1. GitHub Actionsが定期実行される
2. `/api/admin/seed`エンドポイントにPOSTリクエスト
3. 既存データを削除（`action: "reset"`）
4. 新しいシードデータを投入
5. データ件数を確認して成功/失敗を判定

## 6. 手動でのデータ更新

### 6.1 ローカルからの更新

```bash
# 環境変数を設定
export ADMIN_SECRET="your-secret-key"
export VERCEL_URL="https://your-app.vercel.app"

# APIテストスクリプト実行
npm run test:api
```

### 6.2 cURLでの更新

```bash
# データ状況確認
curl -X GET https://your-app.vercel.app/api/admin/seed \
  -H "Authorization: Bearer your-secret-key"

# データ更新
curl -X POST https://your-app.vercel.app/api/admin/seed \
  -H "Authorization: Bearer your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"action": "update"}'

# データ完全リセット
curl -X POST https://your-app.vercel.app/api/admin/seed \
  -H "Authorization: Bearer your-secret-key" \
  -H "Content-Type: application/json" \
  -d '{"action": "reset"}'
```

## 7. 利用可能なコマンド

```bash
# APIテスト実行
npm run test:api

# Vercelビルド（デプロイ時に自動実行）
npm run vercel-build

# 通常の開発用コマンド
npm run dev
npm run build
npm run start
```

## 8. トラブルシューティング

### 8.1 データベース接続エラー

```bash
# ローカルでデータベース接続テスト
npm run db:check
```

### 8.2 Vercelデプロイエラー

1. 環境変数が正しく設定されているか確認
2. BaaSプロバイダーのデータベースが稼働中か確認
3. `DATABASE_URL`の形式が正しいか確認

### 8.3 GitHub Actionsエラー

1. GitHub Secretsが正しく設定されているか確認
2. `VERCEL_URL`が正しいか確認
3. APIエンドポイントが正常に動作するか確認

## 9. セキュリティ注意事項

- `ADMIN_SECRET`は推測困難な文字列を使用
- 本番環境では適切なIPアドレス制限を検討
- APIエンドポイントのレート制限を検討
- データベース接続情報は環境変数で管理

## 10. 費用について

### 無料枠での運用（推奨構成）

- **Vercel**: Hobby plan (無料)
- **Supabase**: Free tier (無料)
- **GitHub Actions**: 月2000分まで無料

この構成なら完全無料で運用可能です。

### 有料プランが必要な場合

- Vercelの使用量が無料枠を超える場合
- データベースの容量/接続数が無料枠を超える場合
- より高い可用性が必要な場合
