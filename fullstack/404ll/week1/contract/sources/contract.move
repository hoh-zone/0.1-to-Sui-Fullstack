module contract::contract;

use std::string::{String};
use sui::event;
use sui::table::{Self,Table};
use sui::object;
use sui::transfer;

//Error
const EProfileExist : u64 = 1;

//Struct
public struct Profile has key{
    id:UID,
    name:String,
    description:String,
}

public struct State has key{
    id:UID,
    users:Table<address,address>
    //owner,profile
}


//Event
public struct ProfileCreated has copy,drop{
    id: ID,
    owner:address
}

public struct FloderCreated has copy,dorp{
    id:ID,
    owner:address
}

//function

fun init(ctx: &mut TxContext){
    let state = State{
        id: object::new(ctx),
        users: table::new(ctx)
    };
    transfer::share_object(state);
}


public entry fun creat_profile(state: &mut State,name:String,description:String,ctx:&mut TxContext){
    let uid = object::new(ctx);
    let owner = ctx.sender();
    assert!(!table::contains(&state.users, owner),EProfileExist);
    let id = object::uid_to_inner(&uid);
    let profile =Profile{
        id: uid,
        name,
        description
    };

    transfer::transfer(profile,owner);
    table::add(&mut state.users,owner,object::id_to_address(&id));
    event::emit(ProfileCreated{
        id,
        owner
    })
}


//检查是否存在，如果存在则返回一个Profile的地址
public fun check_is_profile(user_address:address,state:&State):Option<address>{
    if (table::contains(&state.users, user_address)) {
        option::some(*table::borrow(&state.users, user_address))
    } else {
        option::none()
    }
}

//helper fun
#[test_only]
public fun init_testing(ctx:&mut TxContext){
    init(ctx);
}