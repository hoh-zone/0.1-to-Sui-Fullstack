
/// Module: contract
module weekone::contract;

use std::string::String;

use sui::event;
use sui::table::{Self, Table};

/// Structs
/// Contract State store
public struct State has key {
    id: UID,
    users: Table<address, address>,
}

public struct Profile has key {
    id: UID,
    name: String,
    description: String,
}

/// Errors
const EProfileExist: u64 = 1;

/// Events
public struct ProfileCreated has copy, drop {
    profile: address,
    owner: address,
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(State{
        id: object::new(ctx),
        users: table::new(ctx),
    });
}

/// Entry Functions
public entry fun create_profile_api(
    state: &mut State,
    name: String,
    description: String,
    ctx: &mut TxContext,
): address {
    let owner = tx_context::sender(ctx);
    assert!(!table::contains(&state.users, owner), EProfileExist);
    
    let profile = create_profile(name, description, ctx);

    let profile_address = profile.get_address();

    table::add(&mut state.users, owner, profile_address);
    
    transfer::transfer(profile, owner);

    // emit event
    event::emit(ProfileCreated{
        profile: profile_address,
        owner,
    });

    profile_address
}

/// public functions
/// Create a profile
public fun create_profile(
    name: String,
    description: String,
    ctx: &mut TxContext,
): Profile {
    let uid = object::new(ctx);
    
    Profile {
        id: uid,
        name,
        description,
    }      
}

/// Getter Functions
public fun get_description(
    profile: &Profile,
): String {
    profile.description
}

public fun get_name(
    profile: &Profile,
): String {
    profile.name
}

public fun get_id(
    profile: &Profile,
): ID {
    object::id(profile)
}

public fun get_address(
    profile: &Profile,
): address {
    object::id_address(profile)
}

/// Check if a profile exists
public fun get_profile_by_owner(
    state: &State,
    owner: address,
): Option<address> {
    if(table::contains(&state.users, owner)){
        option::some(*table::borrow(&state.users, owner))
    } else {
        option::none()
    }
}

/// Helper Functions for testing
#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}