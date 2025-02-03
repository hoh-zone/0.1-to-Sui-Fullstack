export type User = {
    profile: string,
    owner: string
}

export type State = {
    users: User[]
}

export type Folder = {
    id: {
        id: string,
    },
    name: string,
    description: string
}

export type ProfileWithAddress = {
    id: string,
    name: string,
    description: string,
    folders: string[]
}

export type Profile = {
    id: string,
    name: string,
    description: string,
    folders: Folder[]
}

export type DynamicCoin = {
    coinType: string,
    coinBalance: string
}

export type FolderCreated = {
    id: string,
    owner: string
}