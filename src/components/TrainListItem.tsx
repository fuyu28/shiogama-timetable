import { forwardRef } from "react";
import {
  DepartureType,
  Direction,
  TimeStatus,
  TrainEndpoint,
} from "@/types/train";

type TrainListItemProps = {
  train: DepartureType;
  direction: Direction;
  timeStatus: TimeStatus;
  trainEndpoint: TrainEndpoint;
};

export const TrainListItem = forwardRef<HTMLDivElement, TrainListItemProps>(
  ({ train, direction, timeStatus, trainEndpoint }, ref) => {
    const borderColor =
      direction === "up" ? "border-blue-500" : "border-green-500";

    const getItemStyle = () => {
      switch (timeStatus) {
        case TimeStatus.Next:
          return "bg-yellow-50 border-yellow-400 shadow-md";
        case TimeStatus.Past:
          return "bg-gray-50 text-gray-400/60";
      }
      switch (trainEndpoint) {
        case TrainEndpoint.First:
          return "bg-green-50 border-green-400 shadow-lg";
        case TrainEndpoint.Last:
          return "bg-red-50 border-red-400 shadow-lg";
        default:
          return "bg-white hover:bg-gray-50";
      }
    };

    return (
      <div
        ref={ref}
        className={`p-4 rounded-lg border-l-4 ${borderColor} ${getItemStyle()} transition-all`}
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-800">
              {train.departureTime}
            </div>
            <div className="text-sm text-gray-600">
              {train.destination}
              {train.note && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {train.note}
                </span>
              )}
              {trainEndpoint === TrainEndpoint.First && (
                <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                  始発
                </span>
              )}
              {trainEndpoint === TrainEndpoint.Last && (
                <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-semibold">
                  終電
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TrainListItem.displayName = "TrainListItem";
