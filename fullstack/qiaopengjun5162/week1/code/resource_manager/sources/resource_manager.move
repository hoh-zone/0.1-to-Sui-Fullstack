/// Module: resource_manager
module resource_manager::resource_manager;

use sui::table::{Self, Table};
use std::string::String;
use sui::event;

const EProfileExist: u64 = 1;

/// Represents the state of the resource manager, including user profiles.
public struct State has key {
    id: UID, // Unique identifier for the state
    users: Table<address, address>, // Mapping of user addresses to profile addresses
}

/// Represents a user profile with an ID, name, and description.
public struct Profile has key {
    id: UID, // Unique identifier for the profile
    name: String, // Name of the profile owner
    description: String, // Description of the profile
}

/// Event emitted when a profile is created.
public struct ProfileCreated has copy, drop {
    profile: address, // Address of the created profile
    owner: address, // Address of the profile owner
}

/// Initializes the resource manager state.
fun init(ctx: &mut TxContext) {
    transfer::share_object(State {
        id: object::new(ctx),
        users: table::new(ctx)
    })
}

/// Creates a new user profile and adds it to the state.
public entry fun create_profile(name: String, description: String, state: &mut State, ctx: &mut TxContext) {
    let owner = tx_context::sender(ctx);
    assert!(!table::contains(&state.users, owner), EProfileExist); // Ensure the user does not already have a profile
    let uid = object::new(ctx);
    let id = object::uid_to_inner(&uid);
    let new_profile = Profile { id: uid, name, description };
    transfer::transfer(new_profile, owner); // Transfer the profile to the owner
    table::add(&mut state.users, owner, object::id_to_address(&id)); // Add the profile to the user's table
    event::emit(ProfileCreated { profile: object::id_to_address(&id), owner }); // Emit profile creation event
}

/// Checks if a user has a profile and returns the profile address if it exists.
public fun check_if_has_profile(user_address: address, state: &State): Option<address> {
    if (table::contains(&state.users, user_address)) {
        option::some(*table::borrow(&state.users, user_address)) // Return the profile address
    } else {
        option::none() // Return none if no profile exists
    }
}

/// Initializes the resource manager for testing purposes.
#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx)
}

