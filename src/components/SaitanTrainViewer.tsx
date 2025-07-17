"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { upTrainsAtom, downTrainsAtom } from "@/atoms/trainAtom";
import { DepartureType } from "@/types/train";
import { toMinutes } from "@/utils/train";
import { findNextTrain } from "@/utils/train";

const CLASS_END_TIMES = ["10:40", "12:20", "14:40", "16:20", "18:00", "19:40"];

const TrainCard = ({
  trains,
  classEndTime,
  direction,
  borderColor,
}: {
  trains: DepartureType[];
  classEndTime: string;
  direction: "上り" | "下り";
  borderColor: string;
}) => {
  const displayTrains = trains.slice(0, 3);

  if (displayTrains.length === 0) {
    return (
      <section className="flex-1 rounded-lg bg-white p-6 shadow-md">
        <h3
          className={`mb-4 border-b-2 ${borderColor} pb-2 text-2xl font-semibold text-gray-700`}
        >
          {direction}
        </h3>
        <div className="space-y-4">
          <div
            className={`flex flex-col items-start justify-center rounded-lg bg-gray-50 p-4 text-left shadow-inner border-l-4 ${borderColor}`}
          >
            <div className="text-gray-400">該当する電車がありません</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 rounded-lg bg-white p-6 shadow-md">
      <h3
        className={`mb-4 border-b-2 ${borderColor} pb-2 text-2xl font-semibold text-gray-700`}
      >
        {direction}
      </h3>
      <div className="space-y-4">
        {displayTrains.map((train, index) => {
          const waitTime =
            toMinutes(train.departureTime) - toMinutes(classEndTime);
          const waitHours = Math.floor(waitTime / 60);
          const waitMinutes = waitTime % 60;

          return (
            <div
              key={`${train.departureTime}-${index}`}
              className={`flex flex-col items-start justify-center rounded-lg bg-gray-50 p-4 text-left shadow-inner border-l-4 ${borderColor}`}
            >
              <div className="flex items-center gap-4 mb-2">
                <div className="text-2xl font-bold text-gray-800">
                  {train.departureTime}
                </div>
                <div className="text-base text-gray-600">
                  {train.destination} 行
                  {train.note && (
                    <span className="block text-xs">({train.note})</span>
                  )}
                </div>
              </div>
              <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {waitHours > 0
                  ? `${waitHours}時間${waitMinutes}分待ち`
                  : `${waitMinutes}分待ち`}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const SaitanTrainViewer = () => {
  const upTrains = useAtomValue(upTrainsAtom);
  const downTrains = useAtomValue(downTrainsAtom);
  const [selectedTime, setSelectedTime] = useState<string>(CLASS_END_TIMES[0]);

  const nextUpTrain = findNextTrain(upTrains, selectedTime);
  const nextDownTrain = findNextTrain(downTrains, selectedTime);

  return (
    <div className="space-y-6">
      {/* 時間選択 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          授業終了時間を選択
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {CLASS_END_TIMES.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                selectedTime === time
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* 検索結果 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedTime}終了後の最短電車
        </h2>

        <div className="flex flex-col md:flex-row md:gap-8">
          {nextUpTrain && (
            <TrainCard
              trains={nextUpTrain}
              classEndTime={selectedTime}
              direction="上り"
              borderColor="border-blue-500"
            />
          )}
          {nextDownTrain && (
            <TrainCard
              trains={nextDownTrain}
              classEndTime={selectedTime}
              direction="下り"
              borderColor="border-green-500"
            />
          )}
        </div>
      </div>
    </div>
  );
};
