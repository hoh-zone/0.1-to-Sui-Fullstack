
/// Module: contract
module weektwo::contract;

use std::string::String;
use std::ascii::{String as AString};

use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::event;
use sui::dynamic_field;
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
    folders: vector<address>,
}

public struct Folder has key {
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

/// Initialize the contract
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

public entry fun create_folder_api(
    name: String,
    description: String,
    profile: &mut Profile,
    ctx: &mut TxContext,
): address {
    let owner = tx_context::sender(ctx);
    let folder = create_folder(name, description, ctx);
    let folder_address = get_fold_address(&folder);
    let id = object::id(&folder);

    vector::push_back(&mut profile.folders, folder_address);

    transfer::transfer(folder, owner);

    // emit event
    event::emit(FolderCreated{
        id,
        owner,
    });

    folder_address
}

/// Add coin to folder
public entry fun add_coin_to_folder<T>(
    folder: &mut Folder,
    coin: Coin<T>,
    _ctx: &mut TxContext,
) {
    let type_name = std::type_name::get<T>();
    let amount = coin::value(&coin);
    let total  =  if(!dynamic_field::exists_(&folder.id, type_name)){
        dynamic_field::add(&mut folder.id, type_name, coin::into_balance(coin));
        amount
    }else{
        let old_value = dynamic_field::borrow_mut<std::type_name::TypeName, Balance<T>>(&mut folder.id, type_name);
        balance::join(old_value, coin::into_balance(coin));
        balance::value(old_value)
    };

    event::emit(CoinWrapped{
        folder: folder.get_fold_address(),
        coin_type: std::type_name::into_string(type_name),
        amount,
        new_balance: total,
    })
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
        folders: vector::empty(),
    }      
}

/// Create a folder
public fun create_folder(
    name: String,
    description: String,
    ctx: &mut TxContext,
): Folder {
    let uid = object::new(ctx);

    Folder {
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

public fun get_fold_address(folder: &Folder): address {
    object::id_address(folder)
}

public fun get_balance<T>(folder: &Folder): u64 {
    let type_name = std::type_name::get<T>();
    if(dynamic_field::exists_(&folder.id, type_name)){
        balance::value(dynamic_field::borrow<std::type_name::TypeName, Balance<T>>(&folder.id, type_name))
    }else{
        0
    }
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