/*
public struct Profile has key {
    id: UID,
    name: string,
    description: string,
}
*/

import { CoinMetadata } from "@mysten/sui/client"

//object结构体
export type Profile = {
  id: {id:string},
  name: string,
  description: string,
  folders: string[],
}


export type DisplayProfile = {
  id: { id: string },
  ownerId: string,
  name: string,
  description: string,
  folders: Folder[],
  assets?: Record<string, SuiObject[]>,
}

export type SuiObject = {
  id: string,
  type: string,
  coinMetadata?: CoinMetadata,
  balance?: number,
}

export type FolderData = {
  name:string,
  value:string,
}

export type Folder = {
  id: {id:string},
  name: string,
  description: string,
  //dynamic_field:by_add_coin_to_folder()
}

export type State = {
  users: User[],
}

export type User ={
  profile:string,
  owner:string,
}

//事件结构体
export type ProfileCreated = {
  id: string,
  owner: string,
}

export type FolderCreated = {
  id: string,
  owner: string,
}

export type CoinWrapped = {
  folder: string,
  coin_type: string,
  amount: number,
  new_balance: number,
}


