import { atom } from "jotai";

export const activeTabAtom = atom<"up" | "down">("up");
