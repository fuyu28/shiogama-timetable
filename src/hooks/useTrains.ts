import { useCallback, useEffect } from "react";
import { useSetAtom } from "jotai";
import * as holiday_jp from "@holiday-jp/holiday_jp";
import { upTrainsAtom, downTrainsAtom } from "@/atoms/trainAtom";
import { isDepartureArray, DepartureType } from "@/types/train";

export const useTrains = (enabled = true) => {
  const setUpTrains = useSetAtom(upTrainsAtom);
  const setDownTrains = useSetAtom(downTrainsAtom);

  const fetchTrain = useCallback(async () => {
    if (!enabled) return;
    const now = new Date();
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    const dayType =
      holiday_jp.isHoliday(now) || isWeekend ? "HOLIDAY" : "WEEKDAY";

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
      const res = await fetch(`${apiUrl}/api/departures?dayType=${dayType}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const data = await res.json();

      if (!isDepartureArray(data)) {
        console.error("Invalid data format received from API");
        return;
      }

      const upTrains = data.filter(
        (train: DepartureType) => train.direction === "UP"
      );
      const downTrains = data.filter(
        (train: DepartureType) => train.direction === "DOWN"
      );

      setUpTrains(upTrains);
      setDownTrains(downTrains);
    } catch (e) {
      console.error("fetch trains failed", e);
    }
  }, [setUpTrains, setDownTrains, enabled]);

  useEffect(() => {
    fetchTrain();
  }, [fetchTrain]);

  return { fetchTrain };
};
