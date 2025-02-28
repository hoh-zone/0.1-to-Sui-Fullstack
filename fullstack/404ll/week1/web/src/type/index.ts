
// public struct Profile has key{
//     id:UID,
//     name:String,
//     description:String
// }

export type Profile = {
    id: string,
    name: string,
    description: string
}
// public struct State has key{
//     id:UID,
//     users:Table<address,address>
//     //owner,profile
// }

export type State = {
    id: string,
    user: user[]
}

type user = {
    address: string,
    profile: string
}