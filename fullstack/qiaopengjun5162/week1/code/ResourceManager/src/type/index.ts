/*
public struct Profile has key {
    id: UID, // Unique identifier for the profile
    name: String, // Name of the profile owner
    description: String, // Description of the profile
}
*/

export type Profile = {
    id: string,
    name: string,
    description: string,
};

/*
public struct State has key {
    id: UID, // Unique identifier for the state
    users: Table<address, address>, // Mapping of user addresses to profile addresses
}
*/

export type State = {
    users: User[],
};

export type User = {
    owner: string,
    profile: string,
};
