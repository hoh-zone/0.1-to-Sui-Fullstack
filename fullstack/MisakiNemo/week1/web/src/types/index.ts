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
