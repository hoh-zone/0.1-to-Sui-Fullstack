module filling::filling;


use std::string::{String};
use sui::event;
use sui::table::{Self, Table};
use sui::coin::{Self, Coin};
use std::type_name::{Self, TypeName};
use sui::dynamic_field;
use sui::dynamic_object_field;
use sui::balance::{Self, Balance};
use std::ascii::{String as AString};

const EProfileExisted: u64 = 0;
const ENotInFolder: u64 = 1;

public struct State has key {
    id: UID,
    users: Table<address, address>,
}

public struct Profile has key {
    id: UID,
    name: String,
    description: String,
    folders: vector<address>,
}

public struct Folder has key, store {
    id: UID,
    name: String,
    description: String,
    
}


public struct ProfileCreated has copy, drop {
    id: ID,
    owner: address
}

public struct FolderCreated has copy, drop {
    id: ID,
    owner: address
}

public struct CoinWrapped has copy, drop {
    coin_type: AString,
    folder: address,
    amount: u64,
    new_balance: u64
}

public struct CoinUnwrapped has copy, drop {
    coin_type: AString,
    folder: address,
    amount: u64,
}

public struct NFTWrapped has copy, drop {
    nft_type: AString,
    folder: address,
    nft: address
}

public struct NFTUnwrapped has copy, drop {
    nft_type: AString,
    folder: address,
    nft: address
}

fun init(ctx: &mut TxContext) {
    let state = State {
        id: object::new(ctx),
        users: table::new(ctx)
    };
    transfer::share_object(state);
}

public entry fun create_profile(
    name: String,
    description: String,
    state: &mut State,
    ctx: &mut TxContext,
) {
    let owner = tx_context::sender(ctx);
    assert!(!table::contains(&state.users, owner), EProfileExisted);
    let uid = object::new(ctx);
    let id = object::uid_to_inner(&uid);
    let new_profile = Profile {
        id: uid,
        name,
        description,
        folders: vector::empty<address>()
    };
    transfer::transfer(new_profile, owner);
    table::add(&mut state.users, owner, object::id_to_address(&id));
    event::emit(
        ProfileCreated {
            id,
            owner
        }
    );
}

public entry fun create_folder(
    name: String,
    description: String,
    profile: &mut Profile,
    ctx: &mut TxContext,
) {
    let owner = tx_context::sender(ctx);
    let uid = object::new(ctx);
    let id = object::uid_to_inner(&uid);
    let new_folder = Folder {
        id: uid,
        name,
        description
    };
    transfer::transfer(new_folder, owner);
    vector::push_back(&mut profile.folders, object::id_to_address(&id));
    event::emit(
        FolderCreated {
            id,
            owner
        }
    );
}

public entry fun add_coin_to_folder<T>(
    folder: &mut Folder,
    coin: Coin<T>,
) {
    let type_name = type_name::get<T>();
    let amount = coin::value(&coin);
    let total;
    if (!dynamic_field::exists_(&folder.id, type_name)) {
        dynamic_field::add(&mut folder.id, type_name, coin::into_balance(coin));
        total = amount;
    } else {
        let old_balance = dynamic_field::borrow_mut<TypeName, Balance<T>>(&mut folder.id, type_name);
        balance::join(old_balance, coin::into_balance(coin));
        total = balance::value(old_balance);
    };
    event::emit(
        CoinWrapped {
            coin_type: type_name::into_string(type_name),
            folder: object::uid_to_address(&folder.id),
            amount,
            new_balance: total
        }
    );
}

public fun remove_coin_from_folder<T>(
    folder: &mut Folder,
    ctx: &mut TxContext
) : Coin<T> {
    let coin_type = type_name::get<T>();
    assert!(dynamic_field::exists_(&folder.id, coin_type), ENotInFolder);
    let b = dynamic_field::remove<TypeName, Balance<T>>(&mut folder.id, coin_type);
    let c = coin::from_balance(b, ctx);
    event::emit(
        CoinUnwrapped {
            coin_type: type_name::into_string(coin_type),
            folder: object::uid_to_address(&folder.id),
            amount: coin::value(&c),
        }
    );
    c
}

public entry fun add_nft_to_folder<T: store+key>(
    folder: &mut Folder,
    nft: T,
) {
    let type_name = type_name::get<T>();
    let nft_addr = object::id_to_address(&object::id(&nft));
    dynamic_object_field::add(&mut folder.id, nft_addr, nft);
    event::emit(
        NFTWrapped {
            nft_type: type_name::into_string(type_name),
            folder: object::uid_to_address(&folder.id),
            nft: nft_addr
        }
    );
}

public fun remove_nft_from_folder<T: store+key>(
    folder: &mut Folder,
    nft_addr: address
) : T {
    let type_name = type_name::get<T>();
    assert!(dynamic_object_field::exists_(&folder.id, nft_addr), ENotInFolder);
    let nft = dynamic_object_field::remove<address, T>(&mut folder.id, nft_addr);
    event::emit(
        NFTUnwrapped {
            nft_type: type_name::into_string(type_name),
            folder: object::uid_to_address(&folder.id),
            nft: nft_addr
        }
    );
    nft
}

public fun check_if_has_profile(
    user_address: address,
    state: &State
): Option<address> {
    if (table::contains(&state.users, user_address)) {
        option::some(*table::borrow(&state.users, user_address))
    } else {
        option::none()
    }
}

public fun get_balance<T>(
    folder: &Folder,
): u64 {
    if (dynamic_field::exists_(&folder.id, type_name::get<T>())) {
        balance::value(dynamic_field::borrow<TypeName, Balance<T>>(&folder.id, type_name::get<T>()))
    } else {
        0
    }
}

public fun check_if_nft_exists(
    folder: &Folder,
    nft_addr: address
): bool {
    dynamic_object_field::exists_(&folder.id, nft_addr)
}

#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}
