
module demo::demo {
    public struct State has key, store{
        id: UID,
        acount: u64,
    }

    fun init(ctx: &mut TxContext) {
        let state = State{
            id: object::new(ctx),
            acount: 0,
        };
        transfer::public_share_object(state);
    }

    public fun deposit(amount: u64, state: &mut State) {
        state.acount = state.acount + amount;
    }
}