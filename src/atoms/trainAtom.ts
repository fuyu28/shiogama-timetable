import { DepartureType } from "@/types/train";
import { atom } from "jotai";

export const upTrainsAtom = atom<DepartureType[]>([]);
export const downTrainsAtom = atom<DepartureType[]>([]);
