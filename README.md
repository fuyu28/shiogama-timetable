# Shiogama-timetable

塩釜口駅の時刻表を表示する Web アプリケーション

## 🚀 クイックスタート

### 前提条件

- Node.js 18 以上
- Docker（データベース用）
- Docker Compose

### 起動手順

1. **リポジトリをクローン**

   ```bash
   git clone https://github.com/fuyu28/shiogama-timetable
   cd shiogama-timetable
   ```

2. **依存関係のインストール**

   ```bash
   npm install
   ```

3. **データベースを起動**

   ```bash
   docker compose up -d db
   ```

4. **データベースのセットアップ**

   ```bash
   npm run db:setup
   ```

5. **開発サーバー起動**

   ```bash
   npm run dev
   ```

6. **アプリケーションにアクセス**
   - ブラウザで [http://localhost:3000](http://localhost:3000) を開く

### 初回起動時の処理

`npm run db:setup` コマンドが以下を実行します：

- PostgreSQL 16 データベースの初期化
- Prisma マイグレーションの実行
- シードデータの投入（時刻表データ）

## 🛠️ 開発環境

### その他の開発コマンド

### 利用可能なコマンド

```bash
# 開発サーバー起動
npm run dev

# データベース関連
npm run db:setup      # データベース初期化
npm run db:migrate    # マイグレーション実行
npm run db:seed       # シードデータ投入
npm run db:reset      # データベースリセット

# ビルド
npm run build
npm run start
```

## 📊 データベース構造

- **PostgreSQL 16** を使用
- **Prisma** でスキーマ管理
- テーブル: `Departure` （電車の出発時刻情報）

## 🔧 技術スタック

- **Frontend**: Next.js 15.3.4 (React 19)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6.10.1
- **Styling**: Tailwind CSS 4
- **State Management**: Jotai 2.12.5
- **Icons**: React Icons
- **Database Container**: Docker + Docker Compose

## 🐛 トラブルシューティング

### ポート 3000 が使用中の場合

```bash
# 開発サーバーを停止（Ctrl+C）
# または、使用中のポートを確認
netstat -ano | findstr :3000
```

### データベース接続エラー

```bash
# データベースコンテナを完全に削除して再起動
docker compose down -v
docker compose up -d db
```

### Node.js 関連のエラー

```bash
# node_modules を削除して再インストール
rm -rf node_modules
npm install
```

## 📝 その他の情報

- データベース設定: [README-DB.md](README-DB.md)
- Vercel 設定: [README-VERCEL.md](README-VERCEL.md)
