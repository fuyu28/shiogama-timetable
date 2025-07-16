"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useAtomValue } from "jotai";
import { currentTimeAtom } from "@/atoms/timeAtom";

type CountdownProps = {
  departureTime: string;
};

export const Countdown = ({ departureTime }: CountdownProps) => {
  const currentTime = useAtomValue(currentTimeAtom);
  const [remaining, setRemaining] = useState({ minutes: 0, seconds: 0 });

  // 時刻解析をメモ化
  const parsedTime = useMemo(() => {
    return departureTime.split(":").map(Number);
  }, [departureTime]);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const now = currentTime;
      now.setMilliseconds(0);
      const [hours, minutes] = parsedTime;

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
  }, [currentTime, parsedTime]);

  return (
    <div className="mt-2 text-xl font-medium text-gray-600">
      残り {String(remaining.minutes).padStart(2, " ")}分{" "}
      {String(remaining.seconds).padStart(2, "0")}秒
    </div>
  );
};
