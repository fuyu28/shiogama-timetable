"use client";

import React from "react";
import { DepartureType } from "@/types/train";
import { Countdown } from "./Countdown";

type TrainDisplayGridProps = {
  trains: DepartureType[];
  title: string;
  borderColor: string;
};

const TrainDisplayGridComponent = ({
  trains,
  title,
  borderColor,
}: TrainDisplayGridProps) => {
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
        {/* 左半分: 次の電車 */}
        <div
          className={`flex flex-col items-start justify-center rounded-lg bg-gray-50 p-4 text-left shadow-inner row-span-2 border-l-4 ${borderColor}`}
        >
          <div className="mb-2 text-sm text-gray-500">次発</div>
          {firstTrain ? (
            <>
              <div className="text-4xl font-bold text-gray-800">
                {firstTrain.departureTime}
              </div>
              <div className="mt-1 text-lg text-gray-600">
                {firstTrain.destination}
                {/* 「行」を小さく、薄くする */}
                <span className="ml-1 text-sm text-gray-500">行</span>
                {firstTrain.note && (
                  <span className="block text-sm">({firstTrain.note})</span>
                )}
              </div>
              <Countdown departureTime={firstTrain.departureTime} />
            </>
          ) : (
            <div className="text-gray-400">情報なし</div>
          )}
        </div>

        {/* 右上: その次の電車 */}
        <div className="flex flex-col items-start justify-center rounded-lg bg-gray-50 p-4 text-left shadow-inner">
          <div className="mb-1 text-sm text-gray-500">次のダイヤ</div>
          {secondTrain ? (
            <>
              <div className="text-2xl font-semibold text-gray-700">
                {secondTrain.departureTime}
              </div>
              <div className="text-base text-gray-600">
                {secondTrain.destination}
                <span className="ml-1 text-xs text-gray-500">行</span>
                {secondTrain.note && (
                  <span className="block text-xs">({secondTrain.note})</span>
                )}
              </div>
            </>
          ) : (
            placeholderCell
          )}
        </div>

        {/* 右下: 次の次の電車 */}
        <div className="flex flex-col items-start justify-center rounded-lg bg-gray-50 p-4 text-left shadow-inner">
          <div className="mb-1 text-sm text-gray-500">次の次のダイヤ</div>
          {thirdTrain ? (
            <>
              <div className="text-2xl font-semibold text-gray-700">
                {thirdTrain.departureTime}
              </div>
              <div className="text-base text-gray-600">
                {thirdTrain.destination}
                <span className="ml-1 text-xs text-gray-500">行</span>
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

TrainDisplayGridComponent.displayName = "TrainDisplayGrid";

export const TrainDisplayGrid = React.memo(TrainDisplayGridComponent);
