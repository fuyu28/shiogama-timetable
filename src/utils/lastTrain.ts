import { DepartureType } from "@/types/train";
import { toMinutes, isEdgeTrain } from "./train";

export const getLastTrain = (trains: DepartureType[]): DepartureType | null => {
  if (trains.length === 0) return null;

  return trains.find(train => isEdgeTrain(train, trains, "last")) || null;
};

export const getLastTrainsByDestination = (trains: DepartureType[]) => {
  const destinationMap = new Map<string, DepartureType[]>();

  trains.forEach((train) => {
    const destination = train.destination;
    if (!destinationMap.has(destination)) {
      destinationMap.set(destination, []);
    }
    destinationMap.get(destination)!.push(train);
  });

  const result: { destination: string; lastTrain: DepartureType | null }[] = [];

  destinationMap.forEach((trains, destination) => {
    const lastTrain = getLastTrain(trains);
    result.push({ destination, lastTrain });
  });

  return result.sort((a, b) => a.destination.localeCompare(b.destination));
};

export const getLastTrainInfo = (
  upTrains: DepartureType[],
  downTrains: DepartureType[]
) => {
  const lastUpTrain = getLastTrain(upTrains);
  const lastDownTrain = getLastTrain(downTrains);

  return {
    up: lastUpTrain,
    down: lastDownTrain,
    upByDestination: getLastTrainsByDestination(upTrains),
    downByDestination: getLastTrainsByDestination(downTrains),
  };
};

export const isLastTrainPassed = (
  lastTrain: DepartureType | null,
  currentTime: string
): boolean => {
  if (!lastTrain) return false;

  const currentMinutes = toMinutes(currentTime);
  const lastMinutes = toMinutes(lastTrain.departureTime);

  return currentMinutes > lastMinutes;
};
