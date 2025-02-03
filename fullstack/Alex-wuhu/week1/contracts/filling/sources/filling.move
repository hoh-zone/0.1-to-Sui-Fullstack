/// Module: filling
module filling::filling{
    use std::string::{String};
    use sui::event;
    use sui::table::{Self,Table};
    //Struct and Variables
    const ProfileExist: u64 = 1;
    
    public struct Profile has key{
        id: UID,
        name: String,
        description:String
    }
    public struct State has key{
        id: UID,
        users:Table<address,address>
    }
    // Event Stucts
    public struct ProfileCreated has copy,drop{
        profile: address,
        owner : address
    }

    // Init
    fun init(ctx:&mut TxContext){
        transfer::share_object(State{
            id: object::new(ctx), 
            users: table::new(ctx),
        });
    }

    //Entry function
    public entry fun create_profile(
        name:String,
        description:String,
        state:&mut State,
        ctx:&mut TxContext,
    )
    {
        let owner = tx_context::sender(ctx);
        assert!(!table::contains(&state.users,owner),ProfileExist);
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        let new_profile = Profile{
            id:uid,
            name,
            description
        };
        transfer::transfer(new_profile, owner);
        table::add(&mut state.users, owner, object::id_to_address(&id));
        event::emit(ProfileCreated{
            profile: object::id_to_address(&id),
            owner,
        });
    }


    public fun check_if_has_profile(
        user_wallet_address: address,
        state: &State,
    ): Option<address>{
        if(table::contains(&state.users, user_wallet_address)){
            option::some(*table::borrow(&state.users, user_wallet_address))
        }else{
            option::none()
        }
    }

    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }

}



//package id: 0xfc728489dea62ac38b211b7e54626052ac9c8789f2d8f18738d2d9122263fa39
//state id: 0x1980b46ede36b4ef1c43bed5cb8422e30e8e32d95b95e8e850956a1c9bee570a
