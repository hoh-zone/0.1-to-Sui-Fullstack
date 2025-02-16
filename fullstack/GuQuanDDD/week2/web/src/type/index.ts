/*    public struct Profile has key{
        id: UID,
        name: String,
        description: String,
    }*/

        import { CoinMetadata } from "@mysten/sui/client"

        export type Profile = {
            id: { id: string },
            name: string,
            description: string,
            folders: string[],
        }
        
        export type DisplayProfile = {
            id: { id: string },
            ownerId: string,
            name: string,
            description: string,
            folders: Folder[],
            assets?: Record<string, SuiObject[]>,
        }
        
        export type SuiObject = {
            id: string,
            type: string,
            coinMetadata?: CoinMetadata,
            balance?: number,
        }
        
        export type FolderData = {
            name:string,
            value:string,
        }
        
        export type Folder = {
            id: { id: string },
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
        
        export type EventProfileCreated = {
            profile: string,
            owner: string,
        }
        
        export type EventFolderCreated = {
            id: string,
            owner: string,
        }
        
        export type EventCoinWrapped = {
            folder: string,
            coin_type: string,
            amount: number,
            new_balance: number,
        }
        