export type DepartureType = {
  id: number;
  direction: string;
  dayType: string;
  departureTime: string; // "HH:MM"
  destination: string;
  note: string | null;
};

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
