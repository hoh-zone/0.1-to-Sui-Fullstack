module demo::demo;
    public struct State has key, store {
        id: UID,
        acount: u64,
    }

    fun init (ctx: &mut TxContext) {
        let state = State {
            id: object::new(ctx),
            acount: 0,
        };
        
        transfer::public_share_object(state);
    }

    public entry fun deposit (state: &mut State, amount: u64) {
        state.acount = state.acount + amount;
    }