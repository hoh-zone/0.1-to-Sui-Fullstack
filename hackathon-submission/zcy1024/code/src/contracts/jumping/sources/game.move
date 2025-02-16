module jumping::game;

use sui::coin::Coin;
use sui::event;
use sui::random::Random;
use sui::sui::SUI;

use jumping::pool::Pool;
use jumping::nft::BlackSquidJumpingNFT;

const ENotPlaying: u64 = 0;
const ENotCorrectPos: u64 = 1;
const ENotCorrectAtoma: u64 = 2;

public struct LoseEvent has copy, drop {
    amount: u64,
    user: address
}

public fun start_game(nft: &mut BlackSquidJumpingNFT, pool: &mut Pool, coin: Coin<SUI>) {
    pool.pay_ticket(coin);
    nft.update(0, 0, true, 0);
}

fun rand_nums(random: &Random, ctx: &mut TxContext): (u8, u8) {
    let mut generator = random.new_generator(ctx);
    let a = generator.generate_u8_in_range(0, 2);
    let offset = generator.generate_u8_in_range(1, 2);
    let b = (a + offset) % 3;
    (a, b)
}

fun peace_move(list: u8, row: u8, nft: &mut BlackSquidJumpingNFT, pool: &mut Pool, ctx: &mut TxContext) {
    let is_move_end = list == 6;
    let award = nft.get_award();
    nft.update(list, row, !is_move_end, award);
    if (is_move_end) {
        pool.disburse_bonus(award, ctx);
    };
}

fun up_move(list: u8, row: u8, nft: &mut BlackSquidJumpingNFT, pool: &mut Pool, ctx: &mut TxContext) {
    let is_move_end = list == 6;
    let award = nft.get_award() + (if (list <= 3) 300_000_000 else if (list <= 5) 600_000_000 else 2_000_000_000);
    nft.update(list, row, !is_move_end, award);
    if (is_move_end) {
        pool.disburse_bonus(award, ctx);
    };
}

entry fun next_position(list: u8, row: u8, random: &Random, nft: &mut BlackSquidJumpingNFT, pool: &mut Pool, ctx: &mut TxContext) {
    assert!(nft.is_playing(), ENotPlaying);
    assert!(list > 0 && list <= 6 && row >= 0 && row <= 2, ENotCorrectPos);
    let (up, down) = rand_nums(random, ctx);
    if (row != up && row != down) {
        peace_move(list, row, nft, pool, ctx);
        return
    };
    if (row == up) {
        up_move(list, row, nft, pool, ctx);
        return
    };
    event::emit(LoseEvent {
        amount: nft.get_award(),
        user: ctx.sender()
    });
    nft.update(list, row, false, 0);
}

public fun end_game(nft: &mut BlackSquidJumpingNFT, pool: &mut Pool, ctx: &mut TxContext) {
    assert!(nft.is_playing(), ENotPlaying);
    let (list, row, award) = nft.get_info();
    nft.update(list, row, false, award);
    pool.disburse_bonus(award, ctx);
}

entry fun next_position2(list: u8, row: u8, down: u8, up: u8, nft: &mut BlackSquidJumpingNFT, pool: &mut Pool, ctx: &mut TxContext) {
    assert!(nft.is_playing(), ENotPlaying);
    assert!(list > 0 && list <= 6 && row >= 0 && row <= 2, ENotCorrectPos);
    assert!(down >= 0 && down <= 2 && up >= 0 && up <= 2 && down != up, ENotCorrectAtoma);
    if (row != up && row != down) {
        peace_move(list, row, nft, pool, ctx);
        return
    };
    if (row == up) {
        up_move(list, row, nft, pool, ctx);
        return
    };
    event::emit(LoseEvent {
        amount: nft.get_award(),
        user: ctx.sender()
    });
    nft.update(list, row, false, 0);
}