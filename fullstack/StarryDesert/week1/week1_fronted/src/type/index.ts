export type Profile = {
    id: string,
    name: string,
    description: string,
}

export interface State {
    users: User[]
}

export interface User {
    owner: string,
    profile: string,
}
