#!/usr/bin/env node

import { PrismaClient } from "@prisma/client/extension";

async function checkDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log("🔍 データベース接続をチェック中...");

    // データベース接続テスト
    await prisma.$connect();
    console.log("✅ データベースに接続しました");

    // テーブル存在チェック
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'Departure'
      );
    `;

    if (tableExists[0].exists) {
      console.log("✅ Departureテーブルが存在します");

      // データ件数チェック
      const count = await prisma.departure.count();
      console.log(`📊 登録済みデータ件数: ${count}件`);

      if (count === 0) {
        console.log(
          "⚠️  データが空です。シードを実行してください: npm run db:seed"
        );
        return false;
      }
    } else {
      console.log(
        "❌ Departureテーブルが存在しません。マイグレーションを実行してください: npm run db:migrate"
      );
      return false;
    }

    console.log("🎉 データベースは正常に設定されています");
    return true;
  } catch (error) {
    console.error("❌ データベースエラー:", error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// スクリプトが直接実行された場合にのみ実行
if (require.main === module) {
  checkDatabase().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { checkDatabase };
