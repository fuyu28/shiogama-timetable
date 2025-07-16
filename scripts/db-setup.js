#!/usr/bin/env node

import { exec } from "child_process";
import { path } from "path";

// データベース初期化スクリプト
async function setupDatabase() {
  console.log("🚀 データベースの初期化を開始します...");

  try {
    // Prisma Migrate実行
    console.log("📊 Prisma Migrateを実行中...");
    await execCommand("npx prisma migrate dev");
    console.log("✅ マイグレーションが完了しました");

    // Prisma Client生成
    console.log("🔧 Prisma Clientを生成中...");
    await execCommand("npx prisma generate");
    console.log("✅ Prisma Clientが生成されました");

    // シードデータ投入
    console.log("🌱 シードデータを投入中...");
    await execCommand("npx prisma db seed");
    console.log("✅ シードデータの投入が完了しました");

    console.log("🎉 データベースの初期化が完了しました！");
  } catch (error) {
    console.error("❌ データベースの初期化に失敗しました:", error);
    process.exit(1);
  }
}

// コマンド実行用のPromiseラッパー
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(
      command,
      { cwd: path.resolve(__dirname, "..") },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        console.log(stdout);
        if (stderr) {
          console.error(stderr);
        }
        resolve();
      },
    );
  });
}

setupDatabase();

module.exports = { setupDatabase };
