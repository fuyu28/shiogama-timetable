export type DepartureType = {
  id: number;
  direction: string;
  dayType: string;
  departureTime: string; // "HH:MM"
  destination: string;
  note: string | null;
};

export function isDepartureType(obj: unknown): obj is DepartureType {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'direction' in obj &&
    'dayType' in obj &&
    'departureTime' in obj &&
    'destination' in obj &&
    'note' in obj &&
    typeof obj.id === 'number' &&
    typeof obj.direction === 'string' &&
    typeof obj.dayType === 'string' &&
    typeof obj.departureTime === 'string' &&
    typeof obj.destination === 'string' &&
    (obj.note === null || typeof obj.note === 'string')
  );
}

export function isDepartureArray(arr: unknown): arr is DepartureType[] {
  return Array.isArray(arr) && arr.every(isDepartureType);
}

export enum TimeStatus {
  Past = "past",
  Next = "next",
  Future = "future",
}

export enum TrainEndpoint {
  Regular = "regular",
  First = "first",
  Last = "last",
}

export enum Direction {
  Up = "up",
  Down = "down",
}
