import { atom } from "jotai";
import { CoinMetaData } from "@/types";

export const coinAtom = atom<CoinMetaData | null>(null);
