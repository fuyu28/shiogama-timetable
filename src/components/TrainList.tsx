import { useEffect, useMemo, useRef } from "react";
import { useAtomValue } from "jotai";
import { useFormat } from "@/hooks/useFormat";
import { currentTimeAtom } from "@/atoms/timeAtom";
import { DepartureType } from "@/types/train";
import { TrainListItem } from "./TrainListItem";
import { isEdgeTrain } from "@/utils/train";

type TrainListProps = {
  trains: DepartureType[];
  direction: "up" | "down";
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
      {trains.map((train) => (
        <TrainListItem
          key={train.id}
          ref={train.id === nextTrain?.id ? nextTrainRef : null}
          train={train}
          isNext={train.id === nextTrain?.id}
          isPast={train.departureTime < formatTimeHHMM(currentTime)}
          direction={direction}
          isFirst={isEdgeTrain(train, trains, "first")}
          isLast={isEdgeTrain(train, trains, "last")}
        />
      ))}
    </div>
  );
};
