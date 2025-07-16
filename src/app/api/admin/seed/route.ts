import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 管理者認証用のシークレットキー
const ADMIN_SECRET = process.env.ADMIN_SECRET || "your-secret-key";

// シードデータ（現在のseed.tsから移植）
import { generateDepartures } from "../../../utils/seed-data";

export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const authHeader = request.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // リクエストボディから更新タイプを取得（現在は使用しないが将来の拡張のため残す）
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { action } = await request.json();

    // 常に既存データを削除してから更新
    console.log("既存データを削除中...");
    await prisma.departure.deleteMany();
    console.log("既存データを削除しました");

    // シードデータを生成（実際のデータは別ファイルに分離）
    const seedData = await generateDepartures();

    // データを投入
    console.log("新しいデータを投入中...");
    await prisma.departure.createMany({
      data: seedData,
      skipDuplicates: false, // 全データ削除後なのでskipDuplicatesは不要
    });

    const count = await prisma.departure.count();

    console.log(`データ更新完了: ${count}件のレコードが投入されました`);

    return NextResponse.json({
      success: true,
      message: `シードデータの更新が完了しました（全データ削除後に${count}件投入）`,
      totalRecords: count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("シードデータ更新エラー:", error);
    return NextResponse.json(
      {
        error: "シードデータの更新に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    // 認証チェック
    const authHeader = request.headers.get("authorization");
    if (!authHeader || authHeader !== `Bearer ${ADMIN_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 現在のデータ状況を確認
    const count = await prisma.departure.count();
    const sample = await prisma.departure.findMany({
      take: 5,
      orderBy: { departureTime: "asc" },
    });

    return NextResponse.json({
      totalRecords: count,
      sampleData: sample,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("データ確認エラー:", error);
    return NextResponse.json(
      {
        error: "データ確認に失敗しました",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
