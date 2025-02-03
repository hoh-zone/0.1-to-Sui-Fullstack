import { CoinMetadata, SuiObjectData } from "@mysten/sui/client";
import { Coin } from "../types";

export const parseFields = <T>(object?: SuiObjectData): T | undefined => {
  return object ? ((object.content as any).fields as T) : undefined;
};

export const parseCoins = (coinObjects: SuiObjectData[], map: Record<string, CoinMetadata>) => {
  return coinObjects.filter(Boolean).map((o) => {
    const fields = parseFields(o) as Coin;
    return { ...fields, type: o.type, metadata: map[o.type!] } as Coin;
  });
};

export const parseCoinId = (type: string) => type.match(/<([^>]+)>/)?.[1] as string;
