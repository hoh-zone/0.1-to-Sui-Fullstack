/*public struct State has key{
        id: UID,
        users: Table<address, address>,
    }
*/
export type State = {
    users: User[],
}

export type User = {
    owner: string,
    profile: string,
}

    
    /*public struct Profile has key{
        id: UID,
        name: String,
        description: String,
        folders: vector<address>,
    }*/
export type Profile = {
    name: string,
    description: string,
    folders: string[],
}




    /*public struct Folder has key{
        id: UID,
        name: String,
        description: String,
        // dynamic field

    }*/

export type Folder = {
    name: string,
    description: string,
}