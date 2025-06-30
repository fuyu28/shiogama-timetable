"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";

type Departure = {
  id: number;
  direction: string;
  dayType: string;
  departureTime: string; // "HH:MM"
  destination: string;
  note: string | null;
};

export function NextTrainsClient() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [trains, setTrains] = useState<Departure[]>([]);
  const nextTimeout = useRef<NodeJS.Timeout | null>(null);

  // フェッチ＆次の再スケジュールを行う関数
  const fetchAndSchedule = useCallback(async () => {
    // ① 列車情報を取得
    try {
      const res = await fetch("/api/trains");
      if (res.ok) {
        const { trains: newTrains } = await res.json();
        setTrains(newTrains);

        // ② 次の発車時刻を Date に変換
        if (newTrains.length > 0) {
          const now = new Date();
          const [h, m] = newTrains[0].departureTime.split(":").map(Number);
          const nextDate = new Date(now);
          nextDate.setHours(h, m, 0, 0);

          // 過去なら翌日に調整
          if (nextDate <= now) {
            nextDate.setDate(nextDate.getDate() + 1);
          }

          // 何ミリ秒後に再フェッチするか
          const delay = nextDate.getTime() - now.getTime() + 500; // +0.5s のバッファ

          // 既存のタイマーはクリア
          if (nextTimeout.current) clearTimeout(nextTimeout.current);

          // そのタイミングで再実行
          nextTimeout.current = setTimeout(fetchAndSchedule, delay);
        }
      }
    } catch (e) {
      console.error("fetch trains failed", e);
    }
  }, []);

  // マウント時に初回セットアップ
  useEffect(() => {
    // 現在時刻更新タイマー（常に走らせてOK）
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    // 列車フェッチ＋次のスケジュール
    fetchAndSchedule();

    return () => {
      clearInterval(clock);
      if (nextTimeout.current) clearTimeout(nextTimeout.current);
    };
  }, [fetchAndSchedule]);

  // HH:MM:SS 表示用
  const fmt = (d: Date) =>
    [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");

  return (
    <div>
      <h2>現在時刻: {fmt(currentTime)}</h2>
      <h3>次の 3 本</h3>
      <ul>
        {trains.map((t) => (
          <li key={t.id}>
            {t.departureTime} — {t.destination}
            {t.note ? ` (${t.note})` : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
