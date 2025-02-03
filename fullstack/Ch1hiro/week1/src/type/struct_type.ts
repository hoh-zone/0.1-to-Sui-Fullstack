export type Profile = {
    id: string,
    name: string,
    description: string,
}

export type State = {
    users: User[]
}

export type User = {
    name: string
    owner: string,
    profile: string,
}