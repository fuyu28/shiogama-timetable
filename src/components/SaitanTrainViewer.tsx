"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { upTrainsAtom, downTrainsAtom } from "@/atoms/trainAtom";
import { TrainDisplayItem } from "./TrainDisplayItem";
import { useTrains } from "@/hooks/useTrains";
import { findNextTrain } from "@/utils/train";

const CLASS_END_TIMES = ["10:40", "12:20", "14:40", "16:20", "18:00", "19:40"];

export const SaitanTrainViewer = () => {
  // 必要な機能を直接呼び出し
  useTrains(true);

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

        <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:gap-8">
          {nextUpTrain && (
            <section className="flex-1 rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 border-b-2 border-blue-500 pb-2 text-2xl font-semibold text-gray-700">
                上り
              </h3>
              <div className="space-y-4">
                {nextUpTrain.length === 0 ? (
                  <div className="flex flex-col items-start justify-center rounded-lg bg-gray-50 p-4 text-left shadow-inner border-l-4 border-blue-500">
                    <div className="text-gray-400">
                      該当する電車がありません
                    </div>
                  </div>
                ) : (
                  nextUpTrain
                    .filter((train, index, array) => 
                      array.findIndex(t => t.id === train.id) === index
                    )
                    .slice(0, 3)
                    .map((train) => (
                      <TrainDisplayItem
                        key={train.id}
                        train={train}
                        direction="上り"
                        classEndTime={selectedTime}
                        showWaitTime={true}
                        size="lg"
                      />
                    ))
                )}
              </div>
            </section>
          )}
          {nextDownTrain && (
            <section className="flex-1 rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-4 border-b-2 border-green-500 pb-2 text-2xl font-semibold text-gray-700">
                下り
              </h3>
              <div className="space-y-4">
                {nextDownTrain.length === 0 ? (
                  <div className="flex flex-col items-start justify-center rounded-lg bg-gray-50 p-4 text-left shadow-inner border-l-4 border-green-500">
                    <div className="text-gray-400">
                      該当する電車がありません
                    </div>
                  </div>
                ) : (
                  nextDownTrain
                    .filter((train, index, array) => 
                      array.findIndex(t => t.id === train.id) === index
                    )
                    .slice(0, 3)
                    .map((train) => (
                      <TrainDisplayItem
                        key={train.id}
                        train={train}
                        direction="下り"
                        classEndTime={selectedTime}
                        showWaitTime={true}
                        size="lg"
                      />
                    ))
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
