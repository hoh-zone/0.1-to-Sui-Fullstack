import { CoinMetadata } from "@mysten/sui/client";

export type ObjectId = string;
export type Address = string;
export type Cursor = string | null | undefined;

export type Profile = {
  id: {
    id: ObjectId;
  };
  name: string;
  description: string;
  folders: string[];
};

export type Folder = {
  id: {
    id: ObjectId;
  };
  name: string;
  description: string;
};

export type Coin = {
  id: {
    id: ObjectId;
  };
  balance: string;
  type: string;
  metadata: CoinMetadata;
};
