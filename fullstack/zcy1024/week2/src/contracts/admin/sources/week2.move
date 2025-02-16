module admin::week2;

use std::string::String;
use std::type_name::{Self, TypeName};
use sui::balance::Balance;
use sui::coin::Coin;
use sui::dynamic_field;
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
    description: String,
    folders: vector<address>
}

public struct Folder has key {
    id: UID,
    name: String,
    description: String
}

public struct ProfileCreated has copy, drop {
    profile: address,
    owner: address
}

public struct FolderCreated has copy, drop {
    id: ID,
    owner: address
}

public struct CoinWrapped has copy, drop {
    folder: address,
    coin_type: String,
    amount: u64,
    new_balance: u64
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
        description,
        folders: vector<address>[]
    }, owner);
    state.users.add(owner, profile_address);
    event::emit(ProfileCreated {
        profile: profile_address,
        owner
    });
}

entry fun create_folder(name: String, description: String, profile: &mut Profile, ctx: &mut TxContext) {
    let owner = ctx.sender();
    let uid = object::new(ctx);
    let id = uid.to_inner();
    let folder_address = uid.to_address();
    transfer::transfer(Folder {
        id: uid,
        name,
        description
    }, owner);
    profile.folders.push_back(folder_address);
    event::emit(FolderCreated {
        id,
        owner
    });
}

entry fun add_coin_to_folder<T>(folder: &mut Folder, coin: Coin<T>) {
    let type_name = type_name::get<T>();
    let amount = coin.value();
    let total;
    if (!dynamic_field::exists_(&folder.id, type_name)) {
        dynamic_field::add(&mut folder.id, type_name, coin.into_balance());
        total = amount;
    } else {
        let balance = dynamic_field::borrow_mut<TypeName, Balance<T>>(&mut folder.id, type_name);
        balance.join(coin.into_balance());
        total = balance.value();
    };
    event::emit(CoinWrapped {
        folder: folder.id.to_address(),
        coin_type: type_name.into_string().to_string(),
        amount,
        new_balance: total
    });
}

public fun check_if_has_profile(user: address, state: &State): Option<address> {
    if (state.users.contains(user)) option::some(state.users[user]) else option::none<address>()
}

public fun get_balance<T>(folder: &Folder): u64 {
    let type_name = type_name::get<T>();
    if (dynamic_field::exists_(&folder.id, type_name))
        dynamic_field::borrow<TypeName, Balance<T>>(&folder.id, type_name).value()
    else
        0
}

#[test_only]
public fun init_for_test(ctx: &mut TxContext) {
    init(ctx);
}