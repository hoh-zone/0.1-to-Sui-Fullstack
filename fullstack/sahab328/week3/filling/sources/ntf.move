module filling::nft;

use std::string::{Self, String};
use sui::url::{Self, Url};
use sui::event;
use std::type_name::{Self, TypeName};
use sui::dynamic_object_field;

const EInvalidCategory: u64 = 0;

public struct NFT has key, store {
    id: UID,
    name: String,
    description: String,
    image: Url,
}

public struct Accessory has key, store {
    id: UID,
    name: String,
    description: String,
    image: Url,
}

public struct NFTMinted has copy, drop {
    owner: address,
    nft: address,
    category: String,
}


public entry fun mint_nft(
    name: String,
    description: String,
    image: String,
    category: String,
    ctx: &mut TxContext
) {
    let owner = tx_context::sender(ctx);
    let uid = object::new(ctx);
    let nft_addr = object::uid_to_address(&uid);
    let categories = vector[string::utf8(b"NFT"), string::utf8(b"Accessory")];
    assert!(vector::contains(&categories, &category), EInvalidCategory);
    if (category == string::utf8(b"NFT")) {
        let nft = NFT {
            id: uid,
            name: name,
            description: description,
            image: url::new_unsafe(string::to_ascii(image)),
        };
        transfer::public_transfer(nft, owner);
    } else {
        let nft = Accessory {
            id: uid,
            name: name,
            description: description,
            image: url::new_unsafe(string::to_ascii(image)),
        };
        transfer::public_transfer(nft, owner);
    };
    
    event::emit(NFTMinted {
        owner: owner,
        nft: nft_addr,
        category: category,
    });
}

public fun add_to_nft<T: key+store>(
    nft: &mut NFT,
    object: T,
    ctx: &mut TxContext
) {
    let type_name = type_name::get<T>();
    if (dynamic_object_field::exists_(&nft.id, type_name)){ 
        remove_from_nft<T>(nft, ctx);
    };
    dynamic_object_field::add<TypeName, T>(&mut nft.id, type_name, object);
}

public fun remove_from_nft<T: key+store>(
    nft: &mut NFT,
    ctx: &mut TxContext
) {
    let owner = tx_context::sender(ctx);
    let type_name = type_name::get<T>();
    let object = dynamic_object_field::remove<TypeName, T>(&mut nft.id, type_name);
    transfer::public_transfer(object, owner);
}

public fun check_if_ntf_has_type<T>(
    nft: &NFT,
): bool{
    dynamic_object_field::exists_(&nft.id, type_name::get<T>())
}