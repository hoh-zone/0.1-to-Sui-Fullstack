/*    public struct Profile has key{
        id: UID,
        name: String,
        description: String,
    }*/

export type Profile = {
    id: string,
    name: string,
    description: string,
}

export type State = {
    users: User[]
}

export type User = {
    owner: string,
    profile: string,
}
