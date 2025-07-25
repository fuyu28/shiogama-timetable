"use client";

import React from "react";
import { useAtomValue } from "jotai";
import { currentTimeAtom } from "@/atoms/timeAtom";
import {
  filteredUpTrainsAtom,
  filteredDownTrainsAtom,
  isLoadingAtom,
} from "@/atoms/trainAtom";
import { useFormat } from "@/hooks/useFormat";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useTrains } from "@/hooks/useTrains";
import { TrainDisplayGrid } from "./TrainDisplayGrid";
import { LoadingFallback } from "./LoadingFallback";

export const NextTrainsClient = () => {
  useCurrentTime(true);
  useTrains(true);

  const currentTime = useAtomValue(currentTimeAtom);
  const upTrains = useAtomValue(filteredUpTrainsAtom);
  const downTrains = useAtomValue(filteredDownTrainsAtom);
  const isLoading = useAtomValue(isLoadingAtom);

  const { formatTime } = useFormat();

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2
        suppressHydrationWarning
        className="mb-8 text-center text-3xl font-bold"
      >
        現在時刻: {formatTime(currentTime)}
      </h2>

      {isLoading ? (
        <LoadingFallback />
      ) : (
        <div className="flex flex-col space-y-8 md:space-y-0 md:flex-row md:gap-8">
          <TrainDisplayGrid
            trains={upTrains}
            title="上り"
            borderColor="border-blue-500"
          />
          <TrainDisplayGrid
            trains={downTrains}
            title="下り"
            borderColor="border-green-500"
          />
        </div>
      )}
    </div>
  );
};
