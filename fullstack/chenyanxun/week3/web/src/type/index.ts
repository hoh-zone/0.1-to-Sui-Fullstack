import { CoinMetadata,  SuiObjectData } from "@mysten/sui/client";

export interface IProfile {
  owner: string;
  profile: string;
}

export interface IContent {
  id: { id: string };
  name: string;
  description: string;
  folders: string[];
}

export interface IFolder {
  id: { id: string };
  name: string;
  description: string;
}

export interface IAssets {
  coinArr: SuiObjectData[];
  nftArr: SuiObjectData[];
}
export interface ICoin extends SuiObjectData {
  coinMetadata?: CoinMetadata;
  splitCoinAmount?: number
}

export interface ISuiParseData {
  dataType: "moveObject";
  fields: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  hasPublicTransfer: boolean;
  type: string;
}

export interface IFolderData {
  coin: folderData[],
  nft: folderData[]
}

interface folderData {
  name: string,
  value: string | null
}

