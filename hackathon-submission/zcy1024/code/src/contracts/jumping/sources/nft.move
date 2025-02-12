module jumping::nft;

use std::string::String;
use sui::display;
use sui::package;
use sui::vec_set::{Self, VecSet};

public struct NFT has drop {}

public struct BlackSquidJumpingNFT has key {
    id: UID,
    name: String,
    image_url: String,
    list: u8,
    row: u8,
    playing: bool,
    award: u64,
    history_data: vector<vector<u8>>
}

public struct MintedVecSet has key {
    id: UID,
    vec_set: VecSet<address>
}

fun init(otw: NFT, ctx: &mut TxContext) {
    let keys = vector[
        b"name".to_string(),
        b"link".to_string(),
        b"image_url".to_string(),
        b"description".to_string(),
        b"project_url".to_string(),
        b"creator".to_string(),
    ];
    let values = vector[
        b"{name}".to_string(),
        b"https://github.com/zcy1024/BlackSquid-Jumping".to_string(),
        b"{image_url}".to_string(),
        b"Good Luck! Have Fun!".to_string(),
        b"https://github.com/zcy1024/BlackSquid-Jumping".to_string(),
        b"Debirth".to_string(),
    ];
    let publisher = package::claim(otw, ctx);
    let mut display = display::new_with_fields<BlackSquidJumpingNFT>(&publisher, keys, values, ctx);
    display.update_version();
    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(display, ctx.sender());
    transfer::share_object(MintedVecSet {
        id: object::new(ctx),
        vec_set: vec_set::empty()
    });
}

public fun mint(vec_set: &mut MintedVecSet, ctx: &mut TxContext): BlackSquidJumpingNFT {
    vec_set.vec_set.insert(ctx.sender());
    BlackSquidJumpingNFT {
        id: object::new(ctx),
        name: b"BlackSquidJumpingNFT".to_string(),
        image_url: b"https://github.com/zcy1024/BlackSquid-Jumping/blob/main/public/NFT.gif?raw=true".to_string(),
        list: 0,
        row: 0,
        playing: false,
        award: 0,
        history_data: vector<vector<u8>>[]
    }
}

public fun mint_and_keep(vec_set: &mut MintedVecSet, ctx: &mut TxContext) {
    transfer::transfer(mint(vec_set, ctx), ctx.sender());
}

public fun transfer(vec_set: &mut MintedVecSet, nft: BlackSquidJumpingNFT, to: address, ctx: &TxContext) {
    if (to != ctx.sender()) {
        vec_set.vec_set.remove(&ctx.sender());
        vec_set.vec_set.insert(to);
    };
    transfer::transfer(nft, to);
}

public fun burn(vec_set: &mut MintedVecSet, nft: BlackSquidJumpingNFT, ctx: &TxContext) {
    vec_set.vec_set.remove(&ctx.sender());
    let BlackSquidJumpingNFT {
        id,
        name: _,
        image_url: _,
        list: _,
        row: _,
        playing: _,
        award: _,
        history_data: _
    } = nft;
    object::delete(id);
}

public(package) fun update(nft: &mut BlackSquidJumpingNFT, list: u8, row: u8, playing: bool, award: u64) {
    nft.list = list;
    nft.row = row;
    nft.playing = playing;
    nft.award = award;
    if (list == 0) {
        nft.history_data.push_back(vector<u8>[]);
    } else {
        let last_idx = nft.history_data.length() - 1;
        nft.history_data[last_idx].push_back(row);
    };
}

public fun is_playing(nft: &BlackSquidJumpingNFT): bool {
    nft.playing
}

public fun get_award(nft: &BlackSquidJumpingNFT): u64 {
    nft.award
}

public fun get_info(nft: &BlackSquidJumpingNFT): (u8, u8, u64) {
    (nft.list, nft.row, nft.award)
}