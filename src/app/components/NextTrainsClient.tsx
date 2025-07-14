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


// 発車時刻までの残り時間を表示するコンポーネント
const Countdown = ({
  departureTime,
  currentTime,
}: {
  departureTime: string;
  currentTime: Date;
}) => {
  const [remaining, setRemaining] = useState({ minutes: 0, seconds: 0 });

  // currentTimeが変更されるたびに残り時間を再計算する
  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = currentTime;
      const [hours, minutes] = departureTime.split(':').map(Number);

      const departureDate = new Date(now);
      departureDate.setHours(hours, minutes, 0, 0);

      // もし計算した発車時刻が現在時刻より過去なら、明日の時刻とする
      if (departureDate < now) {
        departureDate.setDate(departureDate.getDate() + 1);
      }

      const diff = departureDate.getTime() - now.getTime();

      // 差が0以下なら残り時間は0
      if (diff <= 0) {
        return { minutes: 0, seconds: 0 };
      }

      const totalSeconds = Math.floor(diff / 1000);
      const remainingMinutes = Math.floor(totalSeconds / 60);
      const remainingSeconds = totalSeconds % 60;

      return { minutes: remainingMinutes, seconds: remainingSeconds };
    };

    setRemaining(calculateRemainingTime());
  }, [currentTime, departureTime]);

  return (
    <div className="mt-2 text-xl font-medium text-gray-600">
      {/* 2桁表示になるように0埋めする */}
      残り {String(remaining.minutes).padStart(2, ' ')}分 {String(remaining.seconds).padStart(2, '0')}秒
    </div>
  );
};


// 上り、下りそれぞれで電車情報を表示するコンポーネント
const TrainDisplayGrid = ({
  trains,
  title,
  borderColor,
  currentTime,
}: {
  trains: Departure[];
  title: string;
  borderColor: string;
  currentTime: Date;
}) => {
  // 表示する電車を配列から取り出す
  const firstTrain = trains.length > 0 ? trains[0] : null;
  const secondTrain = trains.length > 1 ? trains[1] : null;
  const thirdTrain = trains.length > 2 ? trains[2] : null;

  // 各電車のセルに共通で適用するスタイル
  const cellClasses =
    "flex flex-col items-center justify-center rounded-lg bg-gray-50 p-3 text-center shadow-inner";
  // 電車情報がない場合に表示するプレースホルダー
  const placeholderCell = (
    <div className={cellClasses}>
      <span className="text-gray-400">--:--</span>
    </div>
  );

  return (
    <section className="flex-1 rounded-lg bg-white p-6 shadow-md">
      {/* 上り・下りのタイトル */}
      <h3
        className={`mb-4 border-b-2 ${borderColor} pb-2 text-2xl font-semibold text-gray-700`}
      >
        {title}
      </h3>

      {/* 電車情報をグリッドで表示 */}
      <div
        className="grid grid-cols-2 grid-rows-2 gap-4"
        style={{ minHeight: "240px" }}
      >
        {/* 左半分: 次の電車 --- */}
        <div className={`flex flex-col items-start justify-center rounded-lg bg-gray-50 p-4 text-left shadow-inner row-span-2 border-l-4 ${borderColor}`}>
          <div className="mb-2 text-sm text-gray-500">次発</div>
          {firstTrain ? (
            <>
              <div className="text-4xl font-bold text-gray-800">
                {firstTrain.departureTime}
              </div>
              <div className="mt-1 text-lg text-gray-600">
                {firstTrain.destination} 行
                {firstTrain.note && (
                  <span className="block text-sm">({firstTrain.note})</span>
                )}
              </div>
              <Countdown
                departureTime={firstTrain.departureTime}
                currentTime={currentTime}
              />
            </>
          ) : (
            <div className="text-gray-400">情報なし</div>
          )}
        </div>

        {/* 右上: その次の電車 --- */}
        <div className='flex flex-col items-start justify-center rounded-lg bg-gray-50 p-4 text-left shadow-inner'>
          <div className="mb-1 text-sm text-gray-500">次のダイヤ</div>
          {secondTrain ? (
            <>
              <div className="text-2xl font-semibold text-gray-700">
                {secondTrain.departureTime}
              </div>
              <div className="text-base text-gray-600">
                {secondTrain.destination} 行
                {secondTrain.note && (
                  <span className="block text-xs">({secondTrain.note})</span>
                )}
              </div>
            </>
          ) : (
            placeholderCell
          )}
        </div>

        {/* 右下: 次の次の電車 --- */}
        <div className='flex flex-col items-start justify-center rounded-lg bg-gray-50 p-4 text-left shadow-inner'>
          <div className="mb-1 text-sm text-gray-500">次の次のダイヤ</div>
          {thirdTrain ? (
            <>
              <div className="text-2xl font-semibold text-gray-700">
                {thirdTrain.departureTime}
              </div>
              <div className="text-base text-gray-600">
                {thirdTrain.destination} 行
                {thirdTrain.note && (
                  <span className="block text-xs">({thirdTrain.note})</span>
                )}
              </div>
            </>
          ) : (
            placeholderCell
          )}
        </div>
      </div>
    </section>
  );
};


// メインコンポーネント
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
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-8 text-center text-3xl font-bold">
        現在時刻: {fmt(currentTime)}
      </h2>

      {/* 上りと下りを横に並べる */}
      <div className="flex flex-col md:flex-row md:gap-8">
        {/* 上り方面の表示 */}
        <TrainDisplayGrid
          trains={upTrains}
          title="上り"
          borderColor="border-blue-500"
          currentTime={currentTime}
        />
        {/* 下り方面の表示 */}
        <TrainDisplayGrid
          trains={downTrains}
          title="下り"
          borderColor="border-green-500"
          currentTime={currentTime}
        />
      </div>
    </div>
  );
}
