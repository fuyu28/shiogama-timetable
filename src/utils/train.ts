import { DepartureType, TrainEndpoint } from "@/types/train";

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

  // 時刻でソート
  const sortedTrains = validTrains.sort((a, b) => {
    const minutesA = toMinutes(a.departureTime);
    const minutesB = toMinutes(b.departureTime);
    return minutesA - minutesB;
  });

  // 異なる時刻の電車を3つまで取得
  const uniqueTimeTrains: DepartureType[] = [];
  const seenTimes = new Set<string>();

  for (const train of sortedTrains) {
    if (!seenTimes.has(train.departureTime)) {
      uniqueTimeTrains.push(train);
      seenTimes.add(train.departureTime);
      if (uniqueTimeTrains.length >= 3) break;
    }
  }

  return uniqueTimeTrains;
};

export const getTrainEndpointStatus = (
  target: DepartureType,
  trains: DepartureType[]
): TrainEndpoint => {
  const firstMin = getExtremeMinutes(trains, "min");
  const lastMin = getExtremeMinutes(trains, "max");

  const targetMin = toMinutes(target.departureTime);

  if (firstMin != null && targetMin === firstMin) return TrainEndpoint.First;
  if (lastMin !== null && targetMin === lastMin) return TrainEndpoint.Last;
  return TrainEndpoint.Regular;
};
