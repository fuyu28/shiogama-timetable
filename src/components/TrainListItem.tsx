import { DepartureType } from "@/types/train";

type TrainListItemProps = {
  train: DepartureType;
  isNext: boolean;
  isPast: boolean;
  direction: "up" | "down";
  isFirst: boolean;
  isLast: boolean;
};

export const TrainListItem = ({
  train,
  isNext,
  isPast,
  direction,
  isFirst,
  isLast,
}: TrainListItemProps) => {
  const borderColor =
    direction === "up" ? "border-blue-500" : "border-green-500";

  const getItemStyle = () => {
    if (isNext) return "bg-yellow-50 border-yellow-400 shadow-md";
    if (isPast) return "bg-gray-50 text-gray-400/60";
    if (isFirst) return "bg-green-50 border-green-400 shadow-lg";
    if (isLast) return "bg-red-50 border-red-400 shadow-lg";
    return "bg-white hover:bg-gray-50";
  };

  return (
    <div
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
            {isFirst && (
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-semibold">
                始発
              </span>
            )}
            {isLast && (
              <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-1 rounded font-semibold">
                終電
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
