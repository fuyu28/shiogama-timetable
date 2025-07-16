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
