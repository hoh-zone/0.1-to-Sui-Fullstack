module admin::week4;

use std::string::String;
use std::type_name::{Self, TypeName};
use sui::balance::Balance;
use sui::coin::Coin;
use sui::dynamic_field;
use sui::dynamic_object_field;
use sui::event;
use sui::table::{Self, Table};

const EProfileExist: u64 = 0;
const ENotInFolder: u64 = 1;

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

public struct Folder has key, store {
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

// public struct NFTWrapped has copy, drop {
//     folder: address,
//     nft: address,
//     nft_type: String
// }

public struct ObjWrapped has copy, drop {
    description: String,
    folder: address,
    obj_add: address,
    obj_type: String
}

public struct CoinUnWrapped has copy, drop {
    folder: address,
    coin_type: String,
    amount: u64
}

public struct ObjUnWrapped has copy, drop {
    description: String,
    folder: address,
    obj_add: address,
    obj_type: String
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

public fun add_coin_to_folder<T>(folder: &mut Folder, coin: Coin<T>) {
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

fun add_obj_to_folder<T: key + store>(folder: &mut Folder, obj: T, description: String) {
    let type_name = type_name::get<T>();
    let obj_add = object::id(&obj).to_address();
    dynamic_object_field::add(&mut folder.id, obj_add, obj);
    event::emit(ObjWrapped {
        description,
        folder: folder.id.to_address(),
        obj_add,
        obj_type: type_name.into_string().to_string()
    });
}

public fun add_nft_to_folder<T: key + store>(folder: &mut Folder, nft: T) {
    // let type_name = type_name::get<T>();
    // let nft_add = object::id(&nft).to_address();
    // dynamic_object_field::add(&mut folder.id, nft_add, nft);
    // event::emit(NFTWrapped {
    //     folder: folder.id.to_address(),
    //     nft: nft_add,
    //     nft_type: type_name.into_string().to_string()
    // });
    add_obj_to_folder(folder, nft, b"add nft to folder".to_string());
}

public fun add_subfolder_to_folder(folder: &mut Folder, subfolder: Folder) {
    add_obj_to_folder(folder, subfolder, b"add subfolder to folder".to_string());
}

// public fun remove_coin_from_folder<T>(folder: &mut Folder, type_name: TypeName, ctx: &mut TxContext): Coin<T> {
//     assert!(dynamic_field::exists_(&folder.id, type_name), ENotInFolder);
//     let balance = dynamic_field::remove<TypeName, Balance<T>>(&mut folder.id, type_name);
//     let coin = balance.into_coin(ctx);
//     event::emit(CoinUnWrapped {
//         folder: folder.id.to_address(),
//         coin_type: type_name.into_string().to_string(),
//         amount: coin.value()
//     });
//     coin
// }

public fun remove_coin_from_folder<T>(folder: &mut Folder, ctx: &mut TxContext): Coin<T> {
    let type_name = type_name::get<T>();
    assert!(dynamic_field::exists_(&folder.id, type_name), ENotInFolder);
    let balance = dynamic_field::remove<TypeName, Balance<T>>(&mut folder.id, type_name);
    let coin = balance.into_coin(ctx);
    event::emit(CoinUnWrapped {
        folder: folder.id.to_address(),
        coin_type: type_name.into_string().to_string(),
        amount: coin.value()
    });
    coin
}

fun remove_obj_from_folder<T: key + store>(folder: &mut Folder, obj_add: address, description: String): T {
    assert!(dynamic_object_field::exists_(&folder.id, obj_add), ENotInFolder);
    let obj = dynamic_object_field::remove<address, T>(&mut folder.id, obj_add);
    event::emit(ObjUnWrapped {
        description,
        folder: folder.id.to_address(),
        obj_add,
        obj_type: type_name::get<T>().into_string().to_string()
    });
    obj
}

public fun remove_nft_from_folder<T: key + store>(folder: &mut Folder, nft_add: address): T {
    remove_obj_from_folder<T>(folder, nft_add, b"removed nft from folder".to_string())
}

public fun remove_subfolder_from_folder(folder: &mut Folder, obj_add: address): Folder {
    remove_obj_from_folder<Folder>(folder, obj_add, b"removed subfolder from folder".to_string())
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

// public fun check_if_nft_exists_in_folder(folder: &Folder, nft_add: address): bool {
//     dynamic_object_field::exists_(&folder.id, nft_add)
// }

public fun check_if_obj_exists_in_folder(folder: &Folder, obj_add: address): bool {
    dynamic_object_field::exists_(&folder.id, obj_add)
}

public fun get_exist_subfolder_name(folder: &Folder, obj_add: address): String {
    assert!(check_if_obj_exists_in_folder(folder, obj_add), ENotInFolder);
    let subfolder = dynamic_object_field::borrow<address, Folder>(&folder.id, obj_add);
    subfolder.name
}

#[test_only]
public fun init_for_test(ctx: &mut TxContext) {
    init(ctx);
}