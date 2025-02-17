module contract::trade_coin {
    use sui::coin::{Self, Coin, TreasuryCap, CoinMetadata};
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::sui::SUI;
    use std::type_name::{Self, TypeName};
    use std::ascii::{String as AString};


    // ====== Error Codes ======
    const E_ZERO_AMOUNT: u64 = 0;
    const E_INSUFFICIENT_OUTPUT: u64 = 1;
    const E_NOT_ACTIVE: u64 = 2;
    const E_INVALID_FEE: u64 = 3;
    const E_INVALID_CREATE: u64 = 4;

    // ====== Constants ======
    const BASIS_POINTS: u64 = 10000;
    const DEFAULT_FEE_BPS: u64 = 30;

    public struct AdminCap has key, store {
        id: object::UID
    }

    // ====== Structs ======
    public struct Pool<phantom T> has key {
        id: object::UID,
        sui_reserve: Balance<SUI>,
        token_reserve: Balance<T>,
        virtual_sui_reserve: u128,
        virtual_token_reserve: u128,
        fee_bps: u64,
        is_active: bool,
        max_sui_cap: u64,
        fee_balance: Balance<SUI>,
    }

    // ====== Events ======
    public struct SwapEvent has copy, drop {
        pool_id: object::ID,
        token_type: AString,
        is_buy: bool,
        input_amount: u64,
        output_amount: u64,
        sui_reserve: u64,
        token_reserve: u64,
        sender: address
    }

    public struct PoolCreatedEvent has copy, drop {
        pool_id: object::ID,
        token_type: AString,
        initial_token_supply: u64,
        max_sui_cap: u64,
        virtual_sui_reserve: u128,
        virtual_token_reserve: u128
    }
    
    // ====== Initialization ======
    fun init(ctx: &mut tx_context::TxContext) {
        transfer::transfer(
            AdminCap { id: object::new(ctx) },
            tx_context::sender(ctx)
        );
    }

    // ====== Core Functions ======
    public entry fun create_pool<T>(
        mut treasury_cap: TreasuryCap<T>,
        metadata: CoinMetadata<T>,
        max_sui_cap: u64,
        ctx: &mut tx_context::TxContext
    ) {
        assert!(coin::total_supply(&treasury_cap) == 0, E_INVALID_CREATE);

        let initial_token_supply = 1_000_000_000_000_000_000u64;
        let initial_tokens = coin::mint(&mut treasury_cap, initial_token_supply, ctx);

        let virtual_sui_reserve = 3_000_000_000_000u128; 
        let virtual_token_reserve = 1_000_000_000_000_000_000u128;
        
        let pool = Pool<T> {
            id: object::new(ctx),
            sui_reserve: balance::zero(),
            token_reserve: coin::into_balance(initial_tokens),
            virtual_sui_reserve,
            virtual_token_reserve,
            fee_bps: DEFAULT_FEE_BPS,
            is_active: true,
            max_sui_cap,
            fee_balance: balance::zero()
        };

        event::emit(PoolCreatedEvent {
            pool_id: object::uid_to_inner(&pool.id),
            token_type: type_name::into_string(type_name::get<T>()),
            initial_token_supply,
            max_sui_cap,
            virtual_sui_reserve: pool.virtual_sui_reserve,
            virtual_token_reserve: pool.virtual_token_reserve
        });

        transfer::public_freeze_object<TreasuryCap<T>>(treasury_cap);
        transfer::public_freeze_object<CoinMetadata<T>>(metadata);

        transfer::share_object(pool);
    }

    public entry fun buy<T>(
        pool: &mut Pool<T>,
        sui_in: Coin<SUI>,
        min_tokens_out: u64,
        ctx: &mut tx_context::TxContext
    ) {
        assert!(pool.is_active, E_NOT_ACTIVE);
        
        let sui_amount = coin::value(&sui_in);
        assert!(sui_amount > 0, E_ZERO_AMOUNT);

        let tokens_out = calculate_output_amount(
            sui_amount,
            pool.virtual_sui_reserve,
            pool.virtual_token_reserve
        );
        
        assert!(tokens_out >= min_tokens_out, E_INSUFFICIENT_OUTPUT);

        let fee_amount = (sui_amount * pool.fee_bps) / BASIS_POINTS;
        let sui_after_fee = sui_amount - fee_amount;

        balance::join(&mut pool.sui_reserve, coin::into_balance(sui_in));
        balance::join(&mut pool.fee_balance, balance::split(&mut pool.sui_reserve, fee_amount));
        
        pool.virtual_sui_reserve = pool.virtual_sui_reserve + (sui_after_fee as u128);
        pool.virtual_token_reserve = pool.virtual_token_reserve - (tokens_out as u128);

        event::emit(SwapEvent {
            pool_id: object::uid_to_inner(&pool.id),
            token_type: type_name::into_string(type_name::get<T>()),
            is_buy: true,
            input_amount: sui_amount,
            output_amount: tokens_out,
            sui_reserve: balance::value(&pool.sui_reserve),
            token_reserve: balance::value(&pool.token_reserve),
            sender: tx_context::sender(ctx)
        });

        transfer::public_transfer(
            coin::from_balance(balance::split(&mut pool.token_reserve, tokens_out), ctx),
            tx_context::sender(ctx)
        );
    }

    public entry fun sell<T>(
        pool: &mut Pool<T>,
        tokens_in: Coin<T>,
        min_sui_out: u64,
        ctx: &mut tx_context::TxContext
    ) {
        assert!(pool.is_active, E_NOT_ACTIVE);
        
        let token_amount = coin::value(&tokens_in);
        assert!(token_amount > 0, E_ZERO_AMOUNT);

        let sui_out = calculate_output_amount(
            token_amount,
            pool.virtual_token_reserve,
            pool.virtual_sui_reserve
        );
        
        assert!(sui_out >= min_sui_out, E_INSUFFICIENT_OUTPUT);

        let fee_amount = (sui_out * pool.fee_bps) / BASIS_POINTS;
        let sui_after_fee = sui_out - fee_amount;

        balance::join(&mut pool.token_reserve, coin::into_balance(tokens_in));
        balance::join(&mut pool.fee_balance, balance::split(&mut pool.sui_reserve, fee_amount));

        pool.virtual_token_reserve = pool.virtual_token_reserve + (token_amount as u128);
        pool.virtual_sui_reserve = pool.virtual_sui_reserve - (sui_after_fee as u128);

        event::emit(SwapEvent {
            pool_id: object::uid_to_inner(&pool.id),
            token_type: type_name::into_string(type_name::get<T>()),
            is_buy: false,
            input_amount: token_amount,
            output_amount: sui_after_fee,
            sui_reserve: balance::value(&pool.sui_reserve),
            token_reserve: balance::value(&pool.token_reserve),
            sender: tx_context::sender(ctx)
        });

        transfer::public_transfer(
            coin::from_balance(balance::split(&mut pool.sui_reserve, sui_after_fee), ctx),
            tx_context::sender(ctx)
        );
    }

    // ====== Helper ======
    fun calculate_output_amount(
        input_amount: u64,
        input_reserve: u128,
        output_reserve: u128
    ): u64 {
        let input_amount_128 = (input_amount as u128);
        let numerator = input_amount_128 * output_reserve;
        let denominator = input_reserve + input_amount_128;
        ((numerator / denominator) as u64)
    }

    public fun get_buy_output_amount<T>(
        pool: &Pool<T>,
        sui_amount: u64
    ): u64 {
        calculate_output_amount(
            sui_amount,
            pool.virtual_sui_reserve,
            pool.virtual_token_reserve
        )
    }

    public fun get_sell_output_amount<T>(
        pool: &Pool<T>,
        token_amount: u64
    ): u64 {
        calculate_output_amount(
            token_amount,
            pool.virtual_token_reserve,
            pool.virtual_sui_reserve
        )
    }

    // ====== Admin ======
    public entry fun collect_fees<T>(
        _admin: &AdminCap,
        pool: &mut Pool<T>,
        ctx: &mut tx_context::TxContext
    ) {
        let amount = balance::value(&pool.fee_balance);
        transfer::public_transfer(
            coin::from_balance(balance::split(&mut pool.fee_balance, amount), ctx),
            tx_context::sender(ctx)
        );
    }

    public entry fun update_fee_bps<T>(
         _admin: &AdminCap,
        pool: &mut Pool<T>,
        new_fee_bps: u64,
    ) {
        assert!(new_fee_bps <= 1000, E_INVALID_FEE);
        pool.fee_bps = new_fee_bps;
    }
}


