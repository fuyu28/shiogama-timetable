import { useEffect, useMemo, useRef } from "react";
import { useAtomValue } from "jotai";
import { useFormat } from "@/hooks/useFormat";
import { currentTimeAtom } from "@/atoms/timeAtom";
import { DepartureType, TimeStatus } from "@/types/train";
import { TrainDisplayItem } from "./TrainDisplayItem";
import { getTrainEndpointStatus } from "@/utils/train";
import { Direction } from "@/types/train";

type TrainListProps = {
  trains: DepartureType[];
  direction: Direction;
};

export const TrainList = ({ trains, direction }: TrainListProps) => {
  const nextTrainRef = useRef<HTMLDivElement>(null);
  const currentTime = useAtomValue(currentTimeAtom);
  const { formatTimeHHMM } = useFormat();

  const nextTrain = useMemo(() => {
    const currentTimeStr = formatTimeHHMM(currentTime);
    return trains.find((train) => train.departureTime > currentTimeStr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trains, currentTime]);

  useEffect(() => {
    if (nextTrainRef.current) {
      nextTrainRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [trains, direction]);

  return (
    <div className="space-y-2 p-4">
      {trains.map((train) => {
        const currentTimeHHMM = formatTimeHHMM(currentTime);
        let timeStatus: TimeStatus;
        if (train.departureTime < currentTimeHHMM) {
          timeStatus = TimeStatus.Past;
        } else if (nextTrain?.id === train.id) {
          timeStatus = TimeStatus.Next;
        } else {
          timeStatus = TimeStatus.Future;
        }

        const trainEndpoint = getTrainEndpointStatus(train, trains);
        return (
          <TrainDisplayItem
            key={train.id}
            ref={train.id === nextTrain?.id ? nextTrainRef : null}
            train={train}
            direction={direction}
            timeStatus={timeStatus}
            trainEndpoint={trainEndpoint}
          />
        );
      })}
    </div>
  );
};
