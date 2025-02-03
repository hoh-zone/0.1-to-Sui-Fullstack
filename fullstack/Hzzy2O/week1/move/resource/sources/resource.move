module resource::profile {
    use std::string::{String};
    use sui::table::{Self,Table};
    use sui::event;

    const ERR_PROFILE_EXIST: u64 = 1;

    public struct AllProfile has key {
        id: UID,
        users: Table<address, address>
    }

    public struct Profile has key {
        id: UID,
        name: String,
    }

    public struct ProfileCreated has copy, drop {
        profile: address,
        owner: address,
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
        };
        transfer::transfer(profile, sender);
        table::add(&mut all_profile.users, sender, object::id_to_address(&id));
        event::emit(ProfileCreated {
            profile: object::id_to_address(&id),
            owner: sender,
        });
    }

    public fun is_user_exist(addr: address, all_profile: &AllProfile): Option<address> {
        if (table::contains(&all_profile.users, addr)) {
            option::some(*table::borrow(&all_profile.users, addr))
        } else {
            option::none()
        }
    }

}
