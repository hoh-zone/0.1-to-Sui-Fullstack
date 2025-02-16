/*
public struct Profile has key {
    id: UID,
    name: String,
    desc: String
}
*/

export type Profile = {
    id: string;
    name: string;
    desc: string;
}

/*
public struct State has key {
    id: UID,
    users: Table<address, address>  //存储用户数据
}
*/

export type State = {
    id: string;
    users: user[];
}

type user = {
    profile: string;
    user: string;
}


