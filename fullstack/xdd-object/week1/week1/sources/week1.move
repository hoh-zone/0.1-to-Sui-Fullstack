
module week1::week1;
use std::address;
use std::option::Option;
use std::string::String;
use sui::event;
use sui::object::uid_to_address;
use sui::table;
use sui::table::Table;
use sui::transfer::share_object;

const UserExist:u64 = 1;

public struct State has key {
    id: UID,
    users: Table<address, address>  //存储用户数据
}

public struct Profile has key {
    id: UID,
    name: String,
    desc: String
}

public struct ProfileCreatedEvent has copy, drop { //Profile创建时间
    profile: address, //profile id
    user: address,  //持有的用户id
}

fun init(ctx: &mut TxContext) {
    share_object(State{ //创建一个共享对象
        id: object::new(ctx),
        users: table::new(ctx)
    })
}

public entry fun create_profile(state: &mut State, name: String, desc: String, ctx: &mut TxContext) {
    let user = ctx.sender();
    assert!(!table::contains(&state.users, user), UserExist);

    let profile = Profile{
        id: object::new(ctx),
        name,
        desc
    };
    let v = uid_to_address(&profile.id);
    table::add(&mut state.users, user, v);

    transfer::transfer(profile, user);

    //事件
    event::emit(ProfileCreatedEvent{
        profile: v,
        user
    })
}

//获取用户的profile
public fun get_profile(state: &State, ctx: &mut TxContext) :Option<address> {
    let user = ctx.sender();
    if(table::contains(&state.users, user)) {
        option::some(*table::borrow(&state.users, user))
    } else {
        option::none()
    }
}
























