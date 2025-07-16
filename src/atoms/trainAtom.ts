import { atom } from "jotai";
import { PrimitiveAtom } from "jotai";
import { currentTimeAtom } from "./timeAtom";
import { formatTimeHHMM } from "@/utils/time";
import { DepartureType } from "@/types/train";

export const upTrainsAtom = atom<DepartureType[]>([]);
export const downTrainsAtom = atom<DepartureType[]>([]);

const createFilteredTrainsAtom = (trainsAtom: PrimitiveAtom<DepartureType[]>) =>
  atom<DepartureType[]>((get) => {
    const trains = get(trainsAtom);
    const currentTime = get(currentTimeAtom);
    const now = formatTimeHHMM(currentTime);

    const next = trains.filter((t) => t.departureTime >= now);
    return next.length > 0 ? next.slice(0, 3) : trains.slice(0, 3);
  });

export const filteredUpTrainsAtom = createFilteredTrainsAtom(upTrainsAtom);
export const filteredDownTrainsAtom = createFilteredTrainsAtom(downTrainsAtom);
