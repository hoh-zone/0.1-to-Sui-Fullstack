module resource::profile {
    use std::string::{String};
    use sui::table::{Self,Table};
    use std::ascii::{String as AString};
    use sui::balance::{Self, Balance};
    use sui::coin::{Self, Coin};
    use sui::dynamic_field;
    use sui::dynamic_object_field;
    use std::type_name::{Self, TypeName};
    use sui::event;

    const ERR_PROFILE_EXIST: u64 = 1;

    public struct AllProfile has key {
        id: UID,
        users: Table<address, address>
    }

    public struct Profile has key {
        id: UID,
        name: String,
        folders: vector<address>,
    }

    public struct Folder has key{
        id: UID,
        name: String,
        description: String,
    }

    public struct ProfileCreated has copy, drop {
        profile: address,
        owner: address,
    }

    public struct FolderCreated has copy, drop{
        id: ID,
        owner: address
    }

    public struct CoinWrapped has copy, drop{
        folder: address,
        coin_type: AString,
        amount: u64,
        new_balance: u64,
    }

    public struct NftWrapped has copy, drop{
        folder: address,
        nft: address,
        nft_type: AString
    }

    fun init(ctx: &mut TxContext) {
        transfer::share_object(AllProfile {
            id: object::new(ctx),
            users: table::new(ctx),
        });
    }

    public fun add_profile(name: String, all_profile: &mut AllProfile, ctx: &mut TxContext) {
        let sender = tx_context::sender(ctx);
        assert!(!table::contains(&all_profile.users, sender), ERR_PROFILE_EXIST);
        
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        let profile = Profile {
            id: uid,
            name: name,
            folders: vector::empty(),
        };
        transfer::transfer(profile, sender);
        table::add(&mut all_profile.users, sender, object::id_to_address(&id));
        event::emit(ProfileCreated {
            profile: object::id_to_address(&id),
            owner: sender,
        });
    }
    
    public entry fun create_folder(
        name: String,
        description: String,
        profile: &mut Profile,
        ctx: &mut TxContext
    ){
        let owner = tx_context::sender(ctx);
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        let new_folder = Folder {
            id: uid,
            name,
            description,
        };
        transfer::transfer(new_folder, owner);
        vector::push_back(&mut profile.folders, object::id_to_address(&id));
        event::emit(FolderCreated{
            id,
            owner
        });
    }

    public entry fun add_coin_to_folder<T>(
        folder: &mut Folder,
        coin: Coin<T>,
        ctx: &mut TxContext
    ){
        let type_name = type_name::get<T>();
        let amount = coin::value(&coin);
        let total;
        if(!dynamic_field::exists_(&folder.id, type_name)){
            dynamic_field::add(&mut folder.id, type_name, coin::into_balance(coin));
            total = amount;
        }else{
            let mut old_value = dynamic_field::borrow_mut<TypeName, Balance<T>>(&mut folder.id, type_name);
            balance::join(old_value, coin::into_balance(coin));
            total = balance::value(old_value);
        };
        event::emit(CoinWrapped{
            folder: object::uid_to_address(&folder.id),
            coin_type: type_name::into_string(type_name),
            amount,
            new_balance: total,
        })
    }

    public entry fun add_nft_to_folder<T: store+key>(
        folder: &mut Folder,
        nft: T,
        ctx: &mut TxContext,
    ){
        let type_name = type_name::get<T>();
        let nft_obj_add = object::id_to_address(&object::id(&nft));
        dynamic_object_field::add(&mut folder.id, nft_obj_add, nft);
        event::emit(NftWrapped{
            folder: object::uid_to_address(&folder.id),
            nft: nft_obj_add,
            nft_type: type_name::into_string(type_name),
        })
    }

    public fun is_user_exist(addr: address, all_profile: &AllProfile): Option<address> {
        if (table::contains(&all_profile.users, addr)) {
            option::some(*table::borrow(&all_profile.users, addr))
        } else {
            option::none()
        }
    }

}
