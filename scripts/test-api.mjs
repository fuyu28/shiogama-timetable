#!/usr/bin/env node

import * as https from "https";
import * as http from "http";

// API テスト用スクリプト
async function testAPI() {
  const ADMIN_SECRET = process.env.ADMIN_SECRET || "your-secret-key";
  const API_URL = process.env.VERCEL_URL || "http://localhost:3000";

  console.log("🧪 APIテストを開始します...");
  console.log(`API URL: ${API_URL}`);

  try {
    // 1. データ状況確認
    console.log("\n1. データ状況確認中...");
    const checkResponse = await makeRequest(
      "GET",
      `${API_URL}/api/admin/seed`,
      {
        Authorization: `Bearer ${ADMIN_SECRET}`,
      },
    );

    console.log("✅ 現在のデータ状況:");
    console.log(`   - 総レコード数: ${checkResponse.totalRecords}`);
    console.log(`   - 最終更新: ${checkResponse.lastUpdated}`);

    // 2. データ更新テスト（全データ削除後に新データ投入）
    console.log("\n2. データ更新テスト中...");
    const updateResponse = await makeRequest(
      "POST",
      `${API_URL}/api/admin/seed`,
      {
        Authorization: `Bearer ${ADMIN_SECRET}`,
        "Content-Type": "application/json",
      },
      JSON.stringify({ action: "update" }),
    );

    console.log("✅ データ更新結果:");
    console.log(`   - 成功: ${updateResponse.success}`);
    console.log(`   - 総レコード数: ${updateResponse.totalRecords}`);
    console.log(`   - 更新時刻: ${updateResponse.timestamp}`);

    // 3. 再度データ確認
    console.log("\n3. 更新後データ確認中...");
    const finalCheckResponse = await makeRequest(
      "GET",
      `${API_URL}/api/admin/seed`,
      {
        Authorization: `Bearer ${ADMIN_SECRET}`,
      },
    );

    console.log("✅ 最終確認:");
    console.log(`   - 総レコード数: ${finalCheckResponse.totalRecords}`);
    console.log(
      `   - サンプルデータ: ${JSON.stringify(
        finalCheckResponse.sampleData.slice(0, 2),
        null,
        2,
      )}`,
    );

    console.log("\n🎉 APIテストが完了しました！");
  } catch (error) {
    console.error("❌ APIテストエラー:", error.message);
    process.exit(1);
  }
}

// HTTP/HTTPSリクエスト用のヘルパー関数
function makeRequest(method, url, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === "https:";
    const lib = isHttps ? https : http;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: headers,
    };

    const req = lib.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(jsonData);
          } else {
            reject(
              new Error(`HTTP ${res.statusCode}: ${jsonData.error || data}`),
            );
          }
        } catch (parseError) {
          reject(new Error(`Parse error: ${parseError.message}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (body) {
      req.write(body);
    }

    req.end();
  });
}

// 直接実行時のみ実行
testAPI();

export { testAPI };
