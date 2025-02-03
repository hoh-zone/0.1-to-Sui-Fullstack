/*
/// Module: manage
module manage::manage;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions
module manage::manage;

use std::string::String;
use sui::event;
use sui::table::{Self, Table};

//错误码
const EProfileExist: u64 = 0;

//object结构体
public struct Profile has key {
    id: UID,
    name: String,
    description: String,
}

public struct State has key {
    id: UID,
    //<owner,profile>
    users: Table<address, address>,
}

//事件结构体
public struct ProfileCreated has copy, drop {
    id: ID,
    owner: address,
}

//init函数
fun init(ctx: &mut TxContext) {
    transfer::share_object(State { id: object::new(ctx), users: table::new(ctx) })
}

//entry函数
public entry fun creat_profile(
    name: String,
    description: String,
    state: &mut State,
    ctx: &mut TxContext,
) {
    let uid = object::new(ctx);
    let owner = ctx.sender();
    assert!(!table::contains(&state.users, owner), EProfileExist);
    let id = object::uid_to_inner(&uid);
    let new_profile = Profile {
        id: uid,
        name,
        description,
    };
    transfer::transfer(new_profile, owner);
    table::add(&mut state.users, owner, object::id_to_address(&id));
    event::emit(ProfileCreated { id, owner });
}

//检查用户是否存在
public fun check_is_profile(user_address: address, state: &State): Option<address> {
    if (table::contains(&state.users, user_address)) {
        option::some(*table::borrow(&state.users, user_address))
    } else {
        option::none()
    }
}

//测试代码
#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}
