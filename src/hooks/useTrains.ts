import { useCallback, useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import { upTrainsAtom, downTrainsAtom } from "@/atoms/trainAtom";

export const useTrains = () => {
  const setUpTrains = useSetAtom(upTrainsAtom);
  const setDownTrains = useSetAtom(downTrainsAtom);
  const nextTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchAndSchedule = useCallback(async () => {
    try {
      const res = await fetch("/api/trains");
      if (!res.ok) throw new Error("Network response was not ok");
      const { upTrains: up, downTrains: down } = await res.json();

      setUpTrains(up);
      setDownTrains(down);

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
  }, [setUpTrains, setDownTrains]);

  useEffect(() => {
    fetchAndSchedule();
    return () => {
      if (nextTimeout.current) clearTimeout(nextTimeout.current);
    };
  }, [fetchAndSchedule]);

  return { fetchAndSchedule };
};
