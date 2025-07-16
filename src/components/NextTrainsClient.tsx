"use client";

import React from "react";
import { useAtomValue } from "jotai";
import { currentTimeAtom } from "@/atoms/timeAtom";
import { upTrainsAtom, downTrainsAtom } from "@/atoms/trainAtom";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useTrains } from "@/hooks/useTrains";
import { TrainDisplayGrid } from "./TrainDisplayGrid";

export function NextTrainsClient() {
  const currentTime = useAtomValue(currentTimeAtom);
  const upTrains = useAtomValue(upTrainsAtom);
  const downTrains = useAtomValue(downTrainsAtom);

  // カスタムフックで時刻管理とデータ取得
  useCurrentTime();
  useTrains();

  const fmt = (d: Date) =>
    [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map((n) => String(n).padStart(2, "0"))
      .join(":");

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2
        suppressHydrationWarning
        className="mb-8 text-center text-3xl font-bold"
      >
        現在時刻: {fmt(currentTime)}
      </h2>

      {/* 上りと下りを横に並べる */}
      <div className="flex flex-col md:flex-row md:gap-8">
        {/* 上り方面の表示 */}
        <TrainDisplayGrid
          trains={upTrains}
          title="上り"
          borderColor="border-blue-500"
        />
        {/* 下り方面の表示 */}
        <TrainDisplayGrid
          trains={downTrains}
          title="下り"
          borderColor="border-green-500"
        />
      </div>
    </div>
  );
}
