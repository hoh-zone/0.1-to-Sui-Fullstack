/**
 *  public struct Profile has key{
        id: UID,
        name: String,
        description: String,
  }

 */

export type Profile = {
    id: string,
    name: string,
    description: string
}
 
/**
 * 
 * public struct State has key{
        id: UID,
        // users: vector<address>,
        //alternative <owner_address, profile_object_address>
        users: Table<address, address>,
  }
 */

export type State = {
    users: User[]
}

export type User = {
    owner: string,
    profile: string,
}