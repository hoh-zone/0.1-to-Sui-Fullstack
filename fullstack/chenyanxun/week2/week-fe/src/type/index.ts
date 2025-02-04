import { SuiObjectData } from "@mysten/sui/client";

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