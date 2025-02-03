/*
/// Module: manage
module manage::manage;
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions
module manage::manage;

use std::ascii::String as AString;
use std::string::String;
use std::type_name::{Self, TypeName};
use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::dynamic_field;
use sui::event;
use sui::table::{Self, Table};

//错误码
const EProfileExist: u64 = 0;

//object结构体
public struct Profile has key {
    id: UID,
    name: String,
    description: String,
    folders: vector<address>,
}

public struct Folder has key {
    id: UID,
    name: String,
    description: String,
    //dynamic_field:by_add_coin_to_folder()
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

public struct FolderCreated has copy, drop {
    id: ID,
    owner: address,
}

public struct CoinWrapped has copy, drop {
    folder: address,
    coin_type: AString,
    amount: u64,
    new_balance: u64,
}

//init函数
fun init(ctx: &mut TxContext) {
    transfer::share_object(State { id: object::new(ctx), users: table::new(ctx) })
}

//entry函数

//创建用户
public entry fun create_profile(
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
        folders: vector::empty(),
    };
    transfer::transfer(new_profile, owner);
    table::add(&mut state.users, owner, object::id_to_address(&id));
    event::emit(ProfileCreated { id, owner });
}

//创建folder
public entry fun create_folder(
    name: String,
    description: String,
    profile: &mut Profile,
    ctx: &mut TxContext,
) {
    let uid = object::new(ctx);
    let id = object::uid_to_inner(&uid);
    let fold_address = object::uid_to_address(&uid);
    let owner = ctx.sender();
    let folder = Folder {
        id: uid,
        name,
        description,
    };
    transfer::transfer(folder, owner);
    vector::push_back(&mut profile.folders, fold_address);
    event::emit(FolderCreated { id, owner });
}

//把Coin存到Folder中
public entry fun add_coin_to_folder<T>(coin: Coin<T>, folder: &mut Folder, ctx: &mut TxContext) {
    let type_name = type_name::get<T>();
    let amount = coin::value(&coin);
    let total;
    //在if里写没提示,exists_拼写错误
    if (dynamic_field::exists_(&folder.id, type_name)) {
        let pre_value = dynamic_field::borrow_mut<TypeName, Balance<T>>(
            &mut folder.id,
            type_name,
        );
        let balance = balance::join(
            pre_value,
            coin::into_balance(coin),
        );
        total = balance;
    } else {
        dynamic_field::add(&mut folder.id, type_name, coin::into_balance(coin));
        total = amount;
    };
    event::emit(CoinWrapped {
        folder: object::uid_to_address(&folder.id),
        coin_type: type_name::into_string(type_name),
        amount,
        new_balance: total,
    });
}

public fun add_nft_to_folder() {}

//检查用户是否存在
public fun check_is_profile(user_address: address, state: &State): Option<address> {
    if (table::contains(&state.users, user_address)) {
        option::some(*table::borrow(&state.users, user_address))
    } else {
        option::none()
    }
}

public fun get_balance<T>(folder: &Folder): u64 {
    balance::value(dynamic_field::borrow<TypeName, Balance<T>>(&folder.id, type_name::get<T>()))
}

//测试代码
#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}
