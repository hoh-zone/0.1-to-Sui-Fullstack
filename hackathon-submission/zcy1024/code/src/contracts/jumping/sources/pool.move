module jumping::pool;

use sui::balance::{Self, Balance};
use sui::coin::Coin;
use sui::event;
use sui::package::Publisher;
use sui::sui::SUI;
use sui::vec_map::{Self, VecMap};

const TICKET: u64 = 1_000_000_000;

const ENotCorrectCoinValue: u64 = 0;

public struct Pool has key {
    id: UID,
    balance: Balance<SUI>,
    investor_map: VecMap<address, u64>
}

public struct Bill {
    amount: u64
}

public struct DisburseBonusEvent has copy, drop {
    bonus: u64,
    owner: address
}

fun init(ctx: &mut TxContext) {
    transfer::share_object(Pool {
        id: object::new(ctx),
        balance: balance::zero(),
        investor_map: vec_map::empty()
    });
}

public fun invest(pool: &mut Pool, coin: Coin<SUI>, ctx: &TxContext) {
    let amount = coin.value();
    pool.balance.join(coin.into_balance());
    let owner = ctx.sender();
    if (pool.investor_map.contains(&owner)) {
        let value = &mut pool.investor_map[&owner];
        *value = *value + amount;
    } else {
        pool.investor_map.insert(owner, amount);
    };
}

public fun invest_withdraw(pool: &mut Pool, ctx: &mut TxContext) {
    let total = pool.balance.value();
    let investors_total = pool.get_total();
    let (owner, amount) = pool.investor_map.remove(&ctx.sender());
    let true_amount = if (total >= investors_total) amount else total * amount / investors_total;
    transfer::public_transfer(pool.balance.split(true_amount).into_coin(ctx), owner);
}

public(package) fun pay_ticket(pool: &mut Pool, coin: Coin<SUI>) {
    assert!(coin.value() == TICKET, ENotCorrectCoinValue);
    pool.balance.join(coin.into_balance());
}

fun get_total(pool: &Pool): u64 {
    let mut total = 0;
    let mut investors = pool.investor_map.keys();
    while (investors.length() > 0) {
        let investor = investors.pop_back();
        total = total + pool.investor_map[&investor];
    };
    total
}

fun split_award_to_investors(pool: &mut Pool, amount: u64, total: u64) {
    let mut investors = pool.investor_map.keys();
    while (investors.length() > 0) {
        let investor = investors.pop_back();
        let investe_amount = &mut pool.investor_map[&investor];
        *investe_amount = *investe_amount + (amount * *investe_amount / total);
    };
}

#[allow(lint(self_transfer))]
public(package) fun disburse_bonus(pool: &mut Pool, award: u64, ctx: &mut TxContext) {
    let amount = if (award <= pool.balance.value()) award else pool.balance.value();
    if (amount == 0) {
        return
    };
    let investors_award_amount = amount / 10;
    let bonus = amount - investors_award_amount;
    let owner = ctx.sender();
    event::emit(DisburseBonusEvent { bonus, owner });
    transfer::public_transfer(pool.balance.split(bonus).into_coin(ctx), owner);
    // split award
    let total = pool.balance.value();
    let investors_total = pool.get_total();
    if (total >= investors_total) {
        pool.split_award_to_investors(investors_award_amount, total);
    } else {
        pool.split_award_to_investors(investors_award_amount * 7 / 10, investors_total);
    };
}

entry fun withdraw(_: &Publisher, pool: &mut Pool, ctx: &mut TxContext) {
    let pool_total = pool.balance.value();
    let investors_total = pool.get_total();
    if (pool_total > investors_total) {
        let amount = pool_total - investors_total;
        transfer::public_transfer(pool.balance.split(amount).into_coin(ctx), ctx.sender());
    };
}

public fun loan(pool: &mut Pool, amount: u64, ctx: &mut TxContext): (Coin<SUI>, Bill) {
    (pool.balance.split(amount).into_coin(ctx), Bill {amount})
}

public fun repay(pool: &mut Pool, mut coin: Coin<SUI>, bill: Bill, ctx: &mut TxContext): Coin<SUI> {
    let Bill { amount } = bill;
    pool.balance.join(coin.split(amount + amount / 100, ctx).into_balance());
    coin
}

public fun loan_all(pool: &mut Pool, ctx: &mut TxContext): (Coin<SUI>, Bill) {
    let amount = pool.balance.value();
    (pool.balance.withdraw_all().into_coin(ctx), Bill {amount})
}