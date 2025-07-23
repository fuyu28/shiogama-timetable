import { useAtomValue } from "jotai";
import { upTrainsAtom, downTrainsAtom, isLoadingAtom } from "@/atoms/trainAtom";
import { currentTimeAtom } from "@/atoms/timeAtom";
import { useCurrentTime } from "@/hooks/useCurrentTime";
import { useTrains } from "@/hooks/useTrains";
import { getLastTrainInfo, isLastTrainPassed } from "@/utils/lastTrain";
import { formatTimeHHMM } from "@/utils/time";
import { DepartureType } from "@/types/train";
import { LoadingFallback } from "./LoadingFallback";

const LastTrainCard = ({
  train,
  direction,
  isPassed,
}: {
  train: DepartureType | null;
  direction: "上り" | "下り";
  isPassed: boolean;
}) => {
  if (!train) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-sm text-gray-500 mb-1">{direction}終電</div>
        <div className="text-gray-400">データなし</div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-lg ${
        isPassed ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"
      } border`}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm text-gray-600">{direction}終電</div>
        {isPassed && (
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
            終了
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div
          className={`text-2xl font-bold ${
            isPassed ? "text-red-600" : "text-blue-600"
          }`}
        >
          {train.departureTime}
        </div>
        <div className="text-sm text-gray-600">→ {train.destination}</div>
      </div>

      {train.note && (
        <div className="text-xs text-gray-500 mt-1">{train.note}</div>
      )}
    </div>
  );
};

const LastTrainsByDestination = ({
  trains,
  direction,
  currentTime,
}: {
  trains: { destination: string; lastTrain: DepartureType | null }[];
  direction: "上り" | "下り";
  currentTime: string;
}) => {
  if (trains.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg">
        <div className="text-sm text-gray-500 mb-1">{direction}行先別終電</div>
        <div className="text-gray-400">データなし</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="text-sm font-medium text-gray-700 mb-3">
        {direction}行先別終電
      </div>
      <div className="space-y-2">
        {trains.map(({ destination, lastTrain }) => {
          if (!lastTrain) {
            return (
              <div
                key={destination}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <div className="text-sm text-gray-600">{destination}</div>
                <div className="text-sm text-gray-400">データなし</div>
              </div>
            );
          }

          const isPassed = isLastTrainPassed(lastTrain, currentTime);

          return (
            <div
              key={destination}
              className={`flex justify-between items-center p-2 rounded ${
                isPassed ? "bg-red-50" : "bg-blue-50"
              }`}
            >
              <div className="text-sm text-gray-700">{destination}</div>
              <div className="flex items-center gap-2">
                <div
                  className={`text-sm font-medium ${
                    isPassed ? "text-red-600" : "text-blue-600"
                  }`}
                >
                  {lastTrain.departureTime}
                </div>
                {isPassed && (
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    終了
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const LastTrainViewer = () => {
  useCurrentTime(true);
  useTrains(true);

  const upTrains = useAtomValue(upTrainsAtom);
  const downTrains = useAtomValue(downTrainsAtom);
  const currentTime = useAtomValue(currentTimeAtom);

  const currentTimeString = formatTimeHHMM(currentTime);
  const lastTrainInfo = getLastTrainInfo(upTrains, downTrains);

  const upTrainPassed = isLastTrainPassed(lastTrainInfo.up, currentTimeString);
  const downTrainPassed = isLastTrainPassed(
    lastTrainInfo.down,
    currentTimeString
  );

  const allTrainsPassed = upTrainPassed && downTrainPassed;
  const isLoading = useAtomValue(isLoadingAtom);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="text-lg font-semibold text-gray-800">終電情報</div>
        <div className="text-sm text-gray-500">
          現在時刻: {currentTimeString}
        </div>
      </div>

      {isLoading ? (
        <LoadingFallback />
      ) : (
        <>
          {allTrainsPassed && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="text-red-700 font-medium">
                  本日の終電は終了しました
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <LastTrainCard
              train={lastTrainInfo.up}
              direction="上り"
              isPassed={upTrainPassed}
            />
            <LastTrainCard
              train={lastTrainInfo.down}
              direction="下り"
              isPassed={downTrainPassed}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LastTrainsByDestination
              trains={lastTrainInfo.upByDestination}
              direction="上り"
              currentTime={currentTimeString}
            />
            <LastTrainsByDestination
              trains={lastTrainInfo.downByDestination}
              direction="下り"
              currentTime={currentTimeString}
            />
          </div>
        </>
      )}
    </div>
  );
};
