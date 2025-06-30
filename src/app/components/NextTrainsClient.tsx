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
  const [upTrains, setUpTrains] = useState<Departure[]>([]);
  const [downTrains, setDownTrains] = useState<Departure[]>([]);
  const nextTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchAndSchedule = useCallback(async () => {
    try {
      const res = await fetch("/api/trains");
      if (!res.ok) throw new Error("Network response was not ok");
      const { upTrains: up, downTrains: down } = await res.json();

      setUpTrains(up);
      setDownTrains(down);

      // 次に更新すべき時刻を「上り」と「下り」両方から計算
      const now = new Date();
      const nextTimes = [up, down]
        .filter((list) => list.length > 0)
        .map((list) => {
          const [h, m] = list[0].departureTime.split(":").map(Number);
          const d = new Date(now);
          d.setHours(h, m, 0, 0);
          if (d <= now) d.setDate(d.getDate() + 1);
          return d.getTime();
        });
      if (nextTimes.length > 0) {
        const earliest = Math.min(...nextTimes);
        const delay = earliest - now.getTime() + 500;
        if (nextTimeout.current) clearTimeout(nextTimeout.current);
        nextTimeout.current = setTimeout(fetchAndSchedule, delay);
      }
    } catch (e) {
      console.error("fetch trains failed", e);
    }
  }, []);

  useEffect(() => {
    const clock = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchAndSchedule();
    return () => {
      clearInterval(clock);
      if (nextTimeout.current) clearTimeout(nextTimeout.current);
    };
  }, [fetchAndSchedule]);

  const fmt = (d: Date) =>
    [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-8 text-center text-3xl font-bold">
        現在時刻: {fmt(currentTime)}
      </h2>

      <section className="rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 border-b-2 border-blue-500 pb-2 text-2xl font-semibold text-gray-700">
          上り 次の 3 本
        </h3>
        <ul>
          {upTrains.map((t) => (
            <li key={t.id}>
              {t.departureTime} — {t.destination}
              {t.note ? ` (${t.note})` : ""}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-lg bg-white p-6 shadow-md">
        <h3 className="mb-4 border-b-2 border-green-500 pb-2 text-2xl font-semibold text-gray-700">
          下り 次の 3 本
        </h3>
        <ul>
          {downTrains.map((t) => (
            <li key={t.id}>
              {t.departureTime} — {t.destination}
              {t.note ? ` (${t.note})` : ""}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
