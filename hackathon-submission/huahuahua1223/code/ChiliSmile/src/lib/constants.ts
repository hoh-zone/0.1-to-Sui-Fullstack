export const MAINNET_COUNTER_PACKAGE_ID = "0xTODO";
export const DEVNET_COUNTER_PACKAGE_ID = "0xTODO";
export const TESTNET_ARTWORK_PACKAGE_ID =
  "0xe4e0594e3f9f0f19f4876ce72c029b9e4fae78b267a1a12f2785f46fc1292448";
export const TESTNET_STATE_OBJECT_ID =
  "0x1ba5208470509f0ec35829546bd0f6bcd0ab2a903be00078e1c20eda96db578f";


import { CoinMetadata } from "@mysten/sui/client"

export type Artwork = {
  id: { id: string };
  name: string;
  desc: string;
  content: string;
  model: {variant:string};
  likes: string;
  owner: string, 
  show: boolean,
  create_time: String, 
  total_balace: number;
};

export type SaveArtwork = {
  name: string;
  desc: string;
  content: string;
  model: number;
};

export const modelMap = new Map<string,number>([
   ['LITERATURE', 1],
   ['VIDEO', 2],
   ['PAINTING', 3],
   ['EMOJI', 4],
]) ;


export type UserState = {
  users: User[];
};

export type User = {
  profile: string;
  owner: string;
};

export type State = {
  owners: ArtworkOwner[];
};

export type ArtworkOwner = {
  artwork: string;
  owner: string;
};

export type Like = {
  fields: LikeFields;
  type: string;
};

export type LikeFields = {
  size: number;
  id: { id: string };
};

export type Profile = {
  id: { id: string };
  nfts: string[];
  artworks: string[];
  likes: Like;
};

export type DynamicObjet = {
  id: { id: string };
  name: string;
  value: number;
};


export interface UserProfile{
  userLikes:UserLikes,
  profile:Profile
}


export type UserLikes={
  likes:string[],
  likeBalance:Map<string, number>,
}


export const profileDefaultValue = {
  id: { id: '' },
   nfts: [],
   artworks: [],
   likes: {  fields: { size: 0,id: { id: '' }},type: ''}
}

export const userLikesDefaultValue = {
  likes: [],
  likeBalance: new Map<string, number>()
}


export type SuiObject = {
  id: string,
  type: string,
  coinMetadata?: CoinMetadata,
  balance?: number,
}

