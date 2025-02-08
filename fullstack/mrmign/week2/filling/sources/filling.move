module filling::filling {
    // Dependencies
    use std::string::{String};
    use sui::event;
    use sui::table::{Self, Table};
    use sui::coin::{Self, Coin};
    use std::type_name::{Self, TypeName};
    use sui::dynamic_field;
    use sui::balance::{Self, Balance};
    use std::ascii::{String as AString};

    // Error codes 
    const EProfileExisted: u64 = 0;

    // Structs
    public struct State has key {
        id: UID,
        users: Table<address,address> // owner address, profile object address
    } 

    public struct Profile has key {
        id: UID,
        name: String,
        description: String,
        folders: vector<address>, // folder object address
    }

    public struct Folder has key {
        id: UID,
        name: String,
        description: String,
        // dynamic field
        // sui: balance
        // usdc: 
    }
    
    // Event struct
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

    // Init 
    fun init(ctx: &mut TxContext) {
        transfer::share_object( State{
            id: object::new(ctx),
            users: table::new(ctx)
        })
    }

    // Entry Functions
    public entry fun create_profile(name: String, description: String, state: &mut State, ctx: &mut TxContext) {
        let owner = tx_context::sender(ctx);
        assert!(!table::contains(&state.users, owner), EProfileExisted);
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        let new_profile = Profile{
            id: uid,
            name,
            description,
            folders: vector::empty(),
        };
        transfer::transfer(new_profile, owner);
        table::add(&mut state.users, owner, object::id_to_address(&id));
        event::emit(ProfileCreated{
            id,
            owner
        });
    }

    public entry fun create_folder(name: String, description: String, profile: &mut Profile, ctx: &mut TxContext) {
        let owner = tx_context::sender(ctx);
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        let new_folder = Folder{
            id: uid,
            name, 
            description
        };
        transfer::transfer(new_folder,  owner);
        vector::push_back(&mut profile.folders, object::id_to_address(&id));
        
        event::emit(FolderCreated{
            id,
            owner
        })

    }

    public entry fun add_coin_to_folder<T>(folder: &mut Folder, coin: Coin<T>, _ctx: &mut TxContext) {
        let type_name = type_name::get<T>();
        let amount = coin::value(&coin);
        let total;
        if (!dynamic_field::exists_(&folder.id, type_name)) {
            dynamic_field::add(&mut folder.id, type_name, coin::into_balance(coin));
            total = amount;
        } else {
            let old_value = dynamic_field::borrow_mut<TypeName, Balance<T>>(&mut folder.id, type_name);
            balance::join(old_value, coin::into_balance(coin));
            total = balance::value(old_value);
        };
        
        event::emit(CoinWrapped{
            folder: object::uid_to_address(&folder.id),
            coin_type: type_name::into_string(type_name),
            amount: amount,
            new_balance:total
        })
    }
    

    // Getter Function 
    public fun check_if_has_profile(user_address: address, state: &State) :Option<address> {
        if(table::contains(&state.users, user_address)){
            option::some(*table::borrow(&state.users, user_address))
        } else {
            option::none() 
        }
    }

    public fun get_balance<T>(folder: &Folder): u64 {
        if(dynamic_field::exists_(&folder.id, type_name::get<T>())) {
            balance::value(dynamic_field::borrow<TypeName, Balance<T>>(&folder.id, type_name::get<T>()))
        } else {
            0
        }
    }

    // Helper Function
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx)
    }
}