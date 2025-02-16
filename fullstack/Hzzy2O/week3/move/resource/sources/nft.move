module resource::nft {
    //==============================================================================================
    // Dependencies
    //==============================================================================================
    use std::string::{Self, String};
    use sui::url::{Self, Url};
    use sui::event;
    use sui::dynamic_object_field;
    use std::type_name::{Self, TypeName};

    //==============================================================================================
    // Constants
    //==============================================================================================
    const EInvalidCategory: u64 = 1;
    //==============================================================================================
    // Error codes
    //==============================================================================================

    //==============================================================================================
    // Structs 
    //==============================================================================================
    public struct Pet has key, store{
        id: UID,
        name: String,
        description: String,
        image: Url,
    }

    public struct Toy has key, store{
        id: UID,
        name: String,
        description: String,
        image: Url,
    }

    public struct Accessory has key, store{
        id: UID,
        name: String,
        description: String,
        image: Url,
    }

    //==============================================================================================
    // Event Structs 
    //==============================================================================================
    public struct NFTMinted has copy, drop {
        id: ID,
        owner: address,
        nft: address,
        category: String,
    }

    //==============================================================================================
    // Init
    //==============================================================================================

    //==============================================================================================
    // Entry Functions 
    //==============================================================================================
    public entry fun mint_nft(
        name: String, 
        description: String, 
        category: String,
        image: String,
        ctx: &mut TxContext
    ){
        let owner = tx_context::sender(ctx);
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        let obj_add = object::uid_to_address(&uid);
        let cat = vector[string::utf8(b"Pet"), string::utf8(b"Toy"), string::utf8(b"Accessory")];
        assert!(vector::contains(&cat, &category), EInvalidCategory);
        if (category == string::utf8(b"Pet")){
            let nft = Pet {
                id: uid,
                name,
                description,
                image: url::new_unsafe(string::to_ascii(image))
            };
            transfer::public_transfer(nft, owner);
        }else if(category == string::utf8(b"Toy")){
            let nft = Toy {
                id: uid,
                name,
                description,
                image: url::new_unsafe(string::to_ascii(image))
            };
            transfer::public_transfer(nft, owner);
        }else{
            let nft = Accessory {
                id: uid,
                name,
                description,
                image: url::new_unsafe(string::to_ascii(image))
            };
            transfer::public_transfer(nft, owner);
        };
        
        event::emit(NFTMinted{
            id,
            owner,
            category,
            nft: obj_add
        });
    }

    public fun add_toy_or_accessory<T: key+store>(
        object: T,
        pet: &mut Pet,
        ctx: &mut TxContext,
    ){
        let owner = tx_context::sender(ctx);
        let type_name = type_name::get<T>();
        // remove old toy/accessory, replace with new, old one send back to owner
        // assumption pet can only carry one toy and/or one accessory at one time. 
        if(dynamic_object_field::exists_(&pet.id, type_name)){ 
            let old_obj = dynamic_object_field::remove<TypeName, T>(&mut pet.id, type_name);
            transfer::public_transfer(old_obj, owner);
        };
        dynamic_object_field::add(&mut pet.id, type_name, object);
    }
    //==============================================================================================
    // Getter Functions 
    //==============================================================================================
    public fun check_if_pet_carries_toy_or_accessory<T>(
        pet: &Pet
    ): bool{
        dynamic_object_field::exists_(&pet.id, type_name::get<T>())
    }
    //==============================================================================================
    // Helper Functions 
    //==============================================================================================
}
