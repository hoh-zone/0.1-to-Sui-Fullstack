import { CoinMetadata } from "@mysten/sui/client"

// public struct Profile has key{
//     id:UID,
//     name:String,
//     description:String
// }

export type Profile = {
    id: {id:string}
    name: string,
    description: string,
    floder: string[]//? 为什么不能直接用Folder[]？
}

//前端展示需要
export type DisplayProfile = {
    id: { id: string },
    ownerId: string,
    name: string,
    description: string,
    folders: Folder[],
    assets?: Record<string, SuiObject[]>,
}
// public struct State has key{
//     id:UID,
//     users:Table<address,address>
//     //owner,profile
// }

export type State = {
    users: User[]
}


export type SuiObject = {
    id: string,
    type: string,
    coinMetadata?: CoinMetadata,
    balance?: number,
}

// public struct Folder has key{
//     id:UID,
//     name: String,
//     description:String
//     //dynamicfield
// }

export type Folder = {
    id:{id:string}
    name: string,
    description: string
}

//Folder中的动态字段的数据
export type FolderData = {
    name:string,
    value:string,
}

export type User = {
    owner: string,
    profile: string
}