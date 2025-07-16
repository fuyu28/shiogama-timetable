import { useCallback, useEffect } from "react";
import { useSetAtom } from "jotai";
import { upTrainsAtom, downTrainsAtom } from "@/atoms/trainAtom";

export const useTrains = () => {
  const setUpTrains = useSetAtom(upTrainsAtom);
  const setDownTrains = useSetAtom(downTrainsAtom);

  const fetchTrain = useCallback(async () => {
    try {
      const res = await fetch("/api/trains");
      if (!res.ok) throw new Error("Network response was not ok");
      const { upTrains: up, downTrains: down } = await res.json();

      setUpTrains(up);
      setDownTrains(down);
    } catch (e) {
      console.error("fetch trains failed", e);
    }
  }, [setUpTrains, setDownTrains]);

  useEffect(() => {
    fetchTrain();
  }, [fetchTrain]);

  return { fetchTrain };
};
