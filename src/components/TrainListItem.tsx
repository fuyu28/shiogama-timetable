import { DepartureType } from "@/types/train";

type TrainListItemProps = {
  train: DepartureType;
  isNext: boolean;
  isPast: boolean;
  direction: "up" | "down";
};

export const TrainListItem = ({
  train,
  isNext,
  isPast,
  direction,
}: TrainListItemProps) => {
  const borderColor =
    direction === "up" ? "border-blue-500" : "border-green-500";

  const getItemStyle = () => {
    if (isNext) return "bg-yellow-50 border-yellow-400 shadow-md";
    if (isPast) return "bg-gray-50 text-gray-400/60";
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
          </div>
        </div>
      </div>
    </div>
  );
};
