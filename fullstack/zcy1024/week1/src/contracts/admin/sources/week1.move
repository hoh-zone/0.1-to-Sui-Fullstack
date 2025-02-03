module admin::week1;

use std::string::String;
use sui::event;
use sui::table::{Self, Table};

const EProfileExist: u64 = 0;

public struct State has key {
    id: UID,
    users: Table<address, address>
}

public struct Profile has key {
    id: UID,
    name: String,
    description: String
}

public struct ProfileCreated has copy, drop {
    profile: address,
    owner: address
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(State {
        id: object::new(ctx),
        users: table::new<address, address>(ctx)
    });
}

entry fun create_profile(name: String, description: String, state: &mut State, ctx: &mut TxContext) {
    let owner = ctx.sender();
    assert!(!state.users.contains(owner), EProfileExist);
    let uid = object::new(ctx);
    let profile_address = uid.to_address();
    transfer::transfer(Profile {
        id: uid,
        name,
        description
    }, owner);
    state.users.add(owner, profile_address);
    event::emit(ProfileCreated {
        profile: profile_address,
        owner
    });
}

public fun check_if_has_profile(user: address, state: &State): Option<address> {
    if (state.users.contains(user)) option::some(state.users[user]) else option::none<address>()
}

#[test_only]
public fun init_for_test(ctx: &mut TxContext) {
    init(ctx);
}