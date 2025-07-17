import { atom } from "jotai";
import { Direction } from "@/types/train";

export const activeTabAtom = atom<Direction>(Direction.Up);
