import { DepartureType } from "@/types/train";

export const toMinutes = (timStr: string) => {
  const [rawHour, rawMinute] = timStr.split(":").map(Number);

  // 夜4時以前は当日中として扱う
  const hour = rawHour < 4 ? rawHour + 24 : rawHour;
  return hour * 60 + rawMinute;
};

const getExtremeMinutes = (
  trains: DepartureType[],
  mode: "min" | "max"
): number | null => {
  if (trains.length === 0) return null;

  const allMins = trains.map((t) => toMinutes(t.departureTime));
  return mode === "min" ? Math.min(...allMins) : Math.max(...allMins);
};

export const isEdgeTrain = (
  target: DepartureType,
  trains: DepartureType[],
  mode: "first" | "last"
): boolean => {
  const extreme = getExtremeMinutes(trains, mode === "first" ? "min" : "max");
  if (extreme === null) return false;

  return toMinutes(target.departureTime) === extreme;
};

export const findNextTrain = (
  trains: DepartureType[],
  target: string
): DepartureType[] | null => {
  const targetMin = toMinutes(target);

  // 指定された時間以降の電車のリスト
  const validTrains = trains.filter((train) => {
    const trainMinutes = toMinutes(train.departureTime);
    return trainMinutes >= targetMin;
  });

  if (validTrains.length === 0) return null;

  // 最も早い電車を見つける
  const sortedTrains = validTrains.sort((a, b) => {
    const minutesA = toMinutes(a.departureTime);
    const minutesB = toMinutes(b.departureTime);
    return minutesA - minutesB;
  });

  return sortedTrains.slice(0, 3);
};
