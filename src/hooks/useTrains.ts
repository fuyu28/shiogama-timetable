import { useCallback, useEffect } from "react";
import { useSetAtom } from "jotai";
import { upTrainsAtom, downTrainsAtom } from "@/atoms/trainAtom";

export const useTrains = (enabled = true) => {
  const setUpTrains = useSetAtom(upTrainsAtom);
  const setDownTrains = useSetAtom(downTrainsAtom);

  const fetchTrain = useCallback(async () => {
    if (!enabled) return;

    try {
      const res = await fetch("/api/trains");
      if (!res.ok) throw new Error("Network response was not ok");
      const { upTrains: up, downTrains: down } = await res.json();

      setUpTrains(up);
      setDownTrains(down);
    } catch (e) {
      console.error("fetch trains failed", e);
    }
  }, [setUpTrains, setDownTrains, enabled]);

  useEffect(() => {
    fetchTrain();
  }, [fetchTrain]);

  return { fetchTrain };
};
