//Z5r2EijKN9hDp3u6zSgsBHaEyahNErNQUA2dDG9zpsK
//
module contract::contract{
    //Dependencies
    use std::string::{String};
    use sui::event;
    use sui::table::{Self,Table};


    //Error code
    const EProfileExist: u64=1;

    //Structs
    public struct State has key{
        id:UID,
        users:Table<address,address>,
    }

    public struct Profile has key{
        id:UID,
        name:String,
        description:String,
    }

    //Event structs
    public struct ProfileCreated has copy,drop{
        profile:address,
        owner:address,
    }

    //Init
    fun init(ctx:&mut TxContext){
        transfer::share_object(State{
            id:object::new(ctx),
            users:table::new(ctx),
        })
    }

    //Entry functions
    public entry fun create_profile(
        name:String,
        description:String,
        state:&mut State,
        ctx:&mut TxContext,
        ){
            let owner =tx_context::sender(ctx);
            assert!(!table::contains(&state.users, owner),EProfileExist);
            let uid=object::new(ctx);
            let id=object::uid_to_inner(&uid);
            let new_profile=Profile{
                id:uid,
                name,
                description,
            };
            transfer::transfer(new_profile,owner);
            table::add(&mut state.users,owner,object::id_to_address(&id));
            event::emit(ProfileCreated{
                profile:object::id_to_address(&id),
                owner,
            });
        }

        //getter functions
        public fun check_if_has_profile(
            user_wallet_address:address,
            state:&State,
        ):Option<address>{
            if(table::contains(&state.users,user_wallet_address)){
                option::some(*table::borrow(&state.users,user_wallet_address))
            }else{
                option::none()
            }
        }
}