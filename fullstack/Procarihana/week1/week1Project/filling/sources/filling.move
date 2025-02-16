module filling::filling {
    //==============================================================================================
    // Dependencies
    //==============================================================================================

    use std::string::{String};
    use sui::event;
    use sui::table::{Self, Table};

    //==============================================================================================
    // Constants
    //==============================================================================================

    //==============================================================================================
    // Error codes
    //==============================================================================================

    const EProfileExisted: u64 = 1;

    //==============================================================================================
    // Structs
    //==============================================================================================

    // 合约内存储信息
    // ability 能力
    // key --> defind a sui object  eg: nft
    //     --> 可以转给用户/ share 大家都可以调用
    // drop
    // store
    // copy
    public struct Profile has key {
        // object 的唯一id
        id: UID,
        // object 的信息
        name: String,
        description: String,
    }


    //==============================================================================================
    // Event Structs
    //==============================================================================================

    // 记录哪些用户创建了 object
    public struct State has key {
        // 每个 sui object 都需要
        id: UID,
        // ownew address , profile object address
        users: Table<address, address>
    }

    // 完成 object 创建之后，传递给前端信息
    public struct ProfileCreated has copy, drop {
        // 像前端传递 object 的id
        id: ID,
        // 拥有者的地址
        owner: address,

    }
    //==============================================================================================
    // Init
    //==============================================================================================

    // 初始化的时候，就创建 state 去记录创建 object 的情况
    fun init(ctx: &mut TxContext) {
        // share object 被公共浏览
        transfer::share_object(State {
            id: object::new(ctx),
            users: table::new(ctx),
        });
    }

    //==============================================================================================
    // Entry Functions
    //==============================================================================================

    // 输入信息
    public entry fun create_profile(
        name: String,
        description: String,
        state: &mut State,
        // 辅助性的module，获取 transcation 需要的信息
        ctx: &mut TxContext,
    ) {
        // 获取 owner 的信息,通过 辅助的 txContext 获取
        let owner = tx_context::sender(ctx);
        // 检查：每个用户只能够创建一次
        assert!(!table::contains(&state.users, owner), EProfileExisted);
        // 获取object，需要 一个uid，就需要 create 出来,同样也是通过 txcontext 获取
        let uid = object::new(ctx);
        // 将UID引用转换为ID
        let id = object::uid_to_inner(&uid);
        // 创建一个新的 object
        let new_profile = Profile {
            id: uid,
            name,
            description,
        };
        // 创建完一个新的 object 之后，需要给一个用户(recipitient)
        transfer::transfer(new_profile, owner);
        // 记录创建object 的用户
        table::add(&mut state.users, owner, object::id_to_address(&id));
        // 向前端发送创建 object 的信息
        event::emit(ProfileCreated {
            id,
            owner
        });
    }


    //==============================================================================================
    // Getter Functions
    //==============================================================================================

    // 查询是否创建过 object
    public fun check_if_has_profile(
        user_address: address,
        state: &State
    ):
    Option<address> {
        if (table::contains(&state.users, user_address)) {
            option::some(*table::borrow(&state.users, user_address))
        }else {
            option::none()
        }
    }

    //==============================================================================================
    // Helper Functions
    //==============================================================================================

    // 只有测试的时候才会使用这个 function
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx)
    }
}
