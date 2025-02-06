module admin::nft;

use std::string::String;
use std::type_name::{Self, TypeName};
use sui::dynamic_object_field;
use sui::event;
use sui::url::{Self, Url};

const EInvalidCategory: u64 = 1;

public struct Pet has key, store {
    id: UID,
    name: String,
    description: String,
    image: Url
}

public struct Toy has key, store {
    id: UID,
    name: String,
    description: String,
    image: Url
}

public struct Accessory has key, store {
    id: UID,
    name: String,
    description: String,
    image: Url
}

public struct NFTMinted has copy, drop {
    id: ID,
    owner: address,
    nft: address,
    category: String
}

entry fun mint_nft(name: String, description: String, category: String, image: String, ctx: &mut TxContext) {
    let owner = ctx.sender();
    let uid = object::new(ctx);
    let id = uid.to_inner();
    let nft_addr = uid.to_address();
    let categories = vector<String>[b"Pet".to_string(), b"Toy".to_string(), b"Accessory".to_string()];
    assert!(categories.contains(&category), EInvalidCategory);
    if (category == b"Pet".to_string()) {
        transfer::public_transfer(Pet {
            id: uid,
            name,
            description,
            image: url::new_unsafe(image.to_ascii())
        }, owner);
    } else if (category == b"Toy".to_string()) {
        transfer::public_transfer(Toy {
            id: uid,
            name,
            description,
            image: url::new_unsafe(image.to_ascii())
        }, owner);
    } else {
        transfer::public_transfer(Accessory {
            id: uid,
            name,
            description,
            image: url::new_unsafe(image.to_ascii())
        }, owner);
    };
    event::emit(NFTMinted {
        id,
        owner,
        category,
        nft: nft_addr
    });
}

entry fun add_toy_or_accessory<T: key + store>(object: T, pet: &mut Pet, ctx: &TxContext) {
    let owner = ctx.sender();
    let type_name = type_name::get<T>();
    if (dynamic_object_field::exists_(&pet.id, type_name)) {
        transfer::public_transfer(dynamic_object_field::remove<TypeName, T>(&mut pet.id, type_name), owner);
    };
    dynamic_object_field::add(&mut pet.id, type_name, object);
}

public fun check_if_pet_carries_toy_or_accessory<T: key + store>(pet: &Pet): bool {
    dynamic_object_field::exists_(&pet.id, type_name::get<T>())
}