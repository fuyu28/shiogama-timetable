import * as fs from "fs";
import * as path from "path";

type Entry = [mm: string, mark?: string];

// CSVファイルからPrisma seed.tsと同じ構造に変換する
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function convertCSVToPrismaFormat(
  csvFilePath: string,
): Record<number, Entry[]> {
  const csvContent = fs.readFileSync(csvFilePath, "utf-8");
  const lines = csvContent.split("\n");

  const result: Record<number, Entry[]> = {};

  for (const line of lines) {
    if (!line.trim()) continue;

    const columns = line.split(",");
    if (columns.length < 2) continue;

    // 最初の列から時間（時）を取得
    const hourStr = columns[0];
    if (!hourStr || isNaN(parseInt(hourStr))) continue;

    const hour = parseInt(hourStr);
    const entries: Entry[] = [];

    // 2列目以降から分とマークを取得
    for (let i = 1; i < columns.length; i++) {
      const cell = columns[i].trim();
      if (!cell || cell === "") continue;

      // 時刻データかどうか判定（数字2桁）
      if (/^\d{2}$/.test(cell)) {
        entries.push([cell]);
      } else if (cell.includes("*")) {
        // 急行マーク付きの場合
        const parts = cell.split("*");
        if (parts.length >= 2) {
          const minute = parts[0];
          const mark = "*" + parts[1];
          if (/^\d{2}$/.test(minute)) {
            entries.push([minute, mark]);
          }
        }
      } else if (cell.length > 2) {
        // マーク付きの場合（文字が混在）
        const match = cell.match(/^(\d{2})(.+)$/);
        if (match) {
          const minute = match[1];
          const mark = match[2];
          entries.push([minute, mark]);
        }
      }
    }

    if (entries.length > 0) {
      result[hour] = entries;
    }
  }

  return result;
}

// TypeScriptコードとして出力
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generatePrismaCode(
  upWeekdayData: Record<number, Entry[]>,
  upHolidayData: Record<number, Entry[]>,
  downWeekdayData: Record<number, Entry[]>,
  downHolidayData: Record<number, Entry[]>,
): string {
  const formatEntries = (entries: Entry[]): string => {
    return entries
      .map((entry) => {
        if (entry.length === 1) {
          return `["${entry[0]}"]`;
        } else {
          return `["${entry[0]}", "${entry[1]}"]`;
        }
      })
      .join(", ");
  };

  const formatData = (
    data: Record<number, Entry[]>,
    varName: string,
  ): string => {
    let result = `const ${varName}: Record<number, Entry[]> = {\n`;

    for (let hour = 0; hour < 24; hour++) {
      const entries = data[hour] || [];
      if (entries.length > 0) {
        result += `  ${hour}: [${formatEntries(entries)}],\n`;
      } else {
        result += `  ${hour}: [],\n`;
      }
    }

    result += "};\n\n";
    return result;
  };

  let code = `// 自動生成されたコード\n`;
  code += `type Entry = [mm: string, mark?: string];\n\n`;

  code += formatData(upWeekdayData, "upWeekday");
  code += formatData(upHolidayData, "upHoliday");
  code += formatData(downWeekdayData, "downWeekday");
  code += formatData(downHolidayData, "downHoliday");

  return code;
}

// メイン処理
function main() {
  const dataDir = path.join(__dirname, "..", "data");
  const upCsvPath = path.join(
    dataDir,
    "ポケット時刻表_平日・土休日Ｔ１６塩釜口_up.csv",
  );
  const downCsvPath = path.join(
    dataDir,
    "ポケット時刻表_平日・土休日Ｔ１６塩釜口_down.csv",
  );

  // CSVファイルが存在するかチェック
  if (!fs.existsSync(upCsvPath)) {
    console.error(`ファイルが見つかりません: ${upCsvPath}`);
    return;
  }

  if (!fs.existsSync(downCsvPath)) {
    console.error(`ファイルが見つかりません: ${downCsvPath}`);
    return;
  }

  try {
    // CSVファイルは平日と土休日が左右に分かれているため、
    // 実際の実装では手動で分離する必要があります
    console.log("CSVファイルの構造を確認してください:");
    console.log("- 平日データは左側の列に");
    console.log("- 土休日データは右側の列に");
    console.log("- 手動で分離してから変換を行ってください");

    // 現在のCSVファイルの内容を表示
    const upCsvContent = fs.readFileSync(upCsvPath, "utf-8");
    const downCsvContent = fs.readFileSync(downCsvPath, "utf-8");

    console.log("\n=== 上り CSV ファイルの最初の10行 ===");
    console.log(upCsvContent.split("\n").slice(0, 10).join("\n"));

    console.log("\n=== 下り CSV ファイルの最初の10行 ===");
    console.log(downCsvContent.split("\n").slice(0, 10).join("\n"));

    // サンプルとして現在のseed.tsと同じ形式でデータを出力
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const sampleData: Record<number, Entry[]> = {
      5: [["37"], ["49", "犬"], ["59"]],
      6: [["07", "犬"], ["17"], ["25"]],
    };

    console.log("\n=== 期待される出力形式の例 ===");
    console.log("const upWeekday: Record<number, Entry[]> = {");
    console.log('  5: [["37"], ["49", "犬"], ["59"]],');
    console.log('  6: [["07", "犬"], ["17"], ["25"]],');
    console.log("  // ... 他の時間");
    console.log("};");
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
}

// 実行
main();
