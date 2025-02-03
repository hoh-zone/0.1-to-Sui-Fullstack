export type User = {
    profile: string,
    owner: string
}

export type State = {
    users: User[]
}

export type Profile = {
    id: string,
    name: string,
    description: string
}