"use client";

import React from "react";
import { useAtomValue } from "jotai";
import { currentTimeAtom } from "@/atoms/timeAtom";
import { upTrainsAtom, downTrainsAtom } from "@/atoms/trainAtom";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useTrains } from "@/hooks/useTrains";
import { useFormat } from "@/hooks/useFormat";
import { TrainDisplayGrid } from "./TrainDisplayGrid";
import Link from "next/link";

export const NextTrainsClient = () => {
  const currentTime = useAtomValue(currentTimeAtom);
  const upTrains = useAtomValue(upTrainsAtom);
  const downTrains = useAtomValue(downTrainsAtom);

  // カスタムフックで時刻管理とデータ取得
  useCurrentTime();
  useTrains();
  const { formatTimeHHMM } = useFormat();

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2
        suppressHydrationWarning
        className="mb-8 text-center text-3xl font-bold"
      >
        現在時刻: {formatTimeHHMM(currentTime)}
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
      
      {/* 時刻表一覧へのリンク */}
      <div className="text-center mt-8">
        <Link 
          href="/list"
          className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-sm transition-colors duration-200"
        >
          📋 時刻表一覧を見る
        </Link>
      </div>
    </div>
  );
};
