export type Profile = {
    id: string,
    name: string,
    description: string,
}

export type State = {
    id: string,
    users: user[],
}

type user = {
    address: string,
    profile: string,
}