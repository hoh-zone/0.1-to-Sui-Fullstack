#[allow(unused_use, unused_field, unused_variable, lint(custom_state_change, self_transfer))]
module lovelink::gift {
    use std::string::{Self, utf8, String};
    use sui::package::{Self, Publisher};
    use sui::display::{Self, Display};
    use sui::event;
    use sui::sui::SUI;

    const NOTINVEC: u64 = 0;

    public struct GIFT has drop {}
    
    public struct Gift has key, store {
        id: UID,
        name: String,
        description: String,
        image_url: String,
        data: u64,
    }

    public struct GiftBag has key {
        id: UID,
        gifts: vector<address>,
        owner: address
    }

    public struct GiftCreated has copy, drop {
        gift: address,
        owner: address,
    }

    public struct GiftGivenAway has copy, drop {
        gift_name: String,
        gift_description: String,
        gift_data: u64,
        from: address,
        to: address,
    }

    fun init(otw: GIFT, ctx: &mut TxContext) {
        // 创建NFT
        let keys: vector<String> = vector[
            utf8(b"name"),  
            utf8(b"image_url"), 
            utf8(b"description"),      
            utf8(b"data"),       
            utf8(b"owner"),   
        ];

        let values: vector<String> = vector[
            utf8(b"{name}"),
            utf8(b"{image_url}"),
            utf8(b"{description}"),
            utf8(b"{data}"),
            utf8(b"{owner}"),
        ]; 

        let publisher: Publisher = package::claim(otw, ctx);
        let mut display: Display<Gift> = display::new_with_fields(&publisher, keys, values, ctx);

        display::update_version(&mut display);

        transfer::public_transfer(publisher, tx_context::sender(ctx));
        transfer::public_transfer(display, tx_context::sender(ctx));
    }

    // 创建一个NFT背包
    public fun create_giftBag(ctx: &mut TxContext) {
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        let owner = tx_context::sender(ctx);

        let giftBag = GiftBag {
            id: uid,
            gifts: vector::empty(),
            owner: owner
        };
        transfer::transfer(giftBag, tx_context::sender(ctx));
    }


    public fun create_gift(name: String, description: String, image_url: String, data: u64, giftBag: &mut GiftBag, ctx: &mut TxContext) {
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);

        let owner = tx_context::sender(ctx);

        let gift = Gift {
            id: uid,
            name,
            description,
            image_url,
            data,
        };

        vector::push_back(&mut giftBag.gifts, object::id_to_address(&id));

        transfer::transfer(gift, owner);

        event::emit(GiftCreated {
            gift: object::id_to_address(&id),
            owner: owner
        })
        
    }

    public fun give_away_gift(giftBag: &mut GiftBag, gift: Gift, aiAddress: address, ctx: &mut TxContext) {
        let id = object::uid_to_inner(&gift.id);
        let giftAddress = object::id_to_address(&id);
        let (is_in_vec, index) = vector::index_of<address>(&giftBag.gifts, &giftAddress);
        assert!(is_in_vec, NOTINVEC);
        vector::remove(&mut giftBag.gifts, index);

        event::emit(GiftGivenAway {
            gift_name: gift.name, 
            gift_description: gift.description, 
            gift_data: gift.data,
            from:  tx_context::sender(ctx),
            to: aiAddress,
        });

        transfer::transfer(gift, aiAddress);

    }
}



