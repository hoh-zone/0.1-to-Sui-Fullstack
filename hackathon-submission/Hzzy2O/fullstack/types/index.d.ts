import { Coin } from '@prisma/client';
import type { PoolInfo } from './pool'

export interface CoinMetaData {
  id: string;
  name: string;
  symbol: string;
  description: string;
  icon_url: string;
};

export type CoinInfo = CoinMetaData & PoolInfo & {
  ca: string
  price: number;
  marketcap: number;
}

export type PoolInfo = Omit<Coin, keyof CoinMetaData>
