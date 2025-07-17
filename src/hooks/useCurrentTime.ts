import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { currentTimeAtom } from "@/atoms/timeAtom";

export const useCurrentTime = (enabled = true) => {
  const setCurrentTime = useSetAtom(currentTimeAtom);

  useEffect(() => {
    if (!enabled) return;

    const updateTime = (): void => {
      setCurrentTime(new Date());
    };

    updateTime(); // 初期値を設定
    const clock = setInterval(updateTime, 1000);

    return () => {
      clearInterval(clock);
    };
  }, [setCurrentTime, enabled]);
};
