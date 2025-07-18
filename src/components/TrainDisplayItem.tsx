import { forwardRef } from "react";
import {
  DepartureType,
  Direction,
  TimeStatus,
  TrainEndpoint,
} from "@/types/train";
import { toMinutes } from "@/utils/train";

type TrainDisplayItemProps = {
  train: DepartureType;
  direction: Direction | "上り" | "下り";
  timeStatus?: TimeStatus;
  trainEndpoint?: TrainEndpoint;
  classEndTime?: string;
  showWaitTime?: boolean;
  size?: "sm" | "md" | "lg";
};

export const TrainDisplayItem = forwardRef<
  HTMLDivElement,
  TrainDisplayItemProps
>(
  (
    {
      train,
      direction,
      timeStatus,
      trainEndpoint,
      classEndTime,
      showWaitTime = false,
      size = "md",
    },
    ref
  ) => {
    const getBorderColor = () => {
      if (direction === "up" || direction === "上り") return "border-blue-500";
      if (direction === "down" || direction === "下り")
        return "border-green-500";
      return "border-gray-500";
    };

    const getItemStyle = () => {
      if (timeStatus) {
        switch (timeStatus) {
          case TimeStatus.Next:
            return "bg-yellow-50 border-yellow-400 shadow-md";
          case TimeStatus.Past:
            return "bg-gray-50 text-gray-400/60";
        }
      }

      if (trainEndpoint) {
        switch (trainEndpoint) {
          case TrainEndpoint.First:
            return "bg-green-50 border-green-400 shadow-lg";
          case TrainEndpoint.Last:
            return "bg-red-50 border-red-400 shadow-lg";
        }
      }

      return "bg-gray-50 shadow-inner";
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return {
            container: "p-3",
            time: "text-base font-bold",
            destination: "text-xs",
            note: "text-xs",
          };
        case "lg":
          return {
            container: "p-6",
            time: "text-2xl font-bold",
            destination: "text-base",
            note: "text-xs",
          };
        default: // md
          return {
            container: "p-4",
            time: "text-lg font-bold",
            destination: "text-sm",
            note: "text-xs",
          };
      }
    };

    const waitTime =
      showWaitTime && classEndTime
        ? toMinutes(train.departureTime) - toMinutes(classEndTime)
        : null;

    const waitHours = waitTime ? Math.floor(waitTime / 60) : 0;
    const waitMinutes = waitTime ? waitTime % 60 : 0;

    const sizeClasses = getSizeClasses();
    const borderColor = getBorderColor();

    return (
      <div
        ref={ref}
        className={`${
          sizeClasses.container
        } rounded-lg border-l-4 ${borderColor} ${getItemStyle()} transition-all`}
      >
        <div className="flex flex-col items-start justify-center">
          <div className="flex items-center gap-4 mb-2 w-full">
            <div className={`${sizeClasses.time} text-gray-800`}>
              {train.departureTime}
            </div>
            <div className={`${sizeClasses.destination} text-gray-600 flex-1`}>
              {train.destination}
              {direction === "上り" || direction === "下り" ? " 行" : ""}

              {train.note && (
                <span
                  className={`ml-2 ${sizeClasses.note} bg-blue-100 text-blue-800 px-2 py-1 rounded`}
                >
                  {train.note}
                </span>
              )}

              {trainEndpoint === TrainEndpoint.First && (
                <span
                  className={`ml-2 ${sizeClasses.note} bg-green-100 text-green-800 px-2 py-1 rounded font-semibold`}
                >
                  始発
                </span>
              )}

              {trainEndpoint === TrainEndpoint.Last && (
                <span
                  className={`ml-2 ${sizeClasses.note} bg-red-100 text-red-800 px-2 py-1 rounded font-semibold`}
                >
                  終電
                </span>
              )}
            </div>
          </div>

          {showWaitTime && waitTime !== null && (
            <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              {waitHours > 0
                ? `${waitHours}時間${waitMinutes}分待ち`
                : `${waitMinutes}分待ち`}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TrainDisplayItem.displayName = "TrainDisplayItem";
