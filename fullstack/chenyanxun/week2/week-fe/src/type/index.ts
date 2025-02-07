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
    [key: string]: any;
  };
  hasPublicTransfer: boolean;
  type: string;
}

export interface IFolderData {
  name: string,
  value: string
}
