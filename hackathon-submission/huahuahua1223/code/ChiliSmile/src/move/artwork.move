module artwork::artwork;

use std::string::{Self, String};
use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::event;
use sui::sui::SUI;
use sui::table::{Self, Table};
use sui::transfer::{share_object, public_transfer};

//==============================================================================================
// Error codes
const FEE_FEW: u64 = 1;
const FEETOSMALL: u64 = 1;
const USEREXISTS: u64 = 1;
const USERNOTEXISTS: u64 = 1;
const EPROFILEEXIST: u64 = 1;
//==============================================================================================

//==============================================================================================
// Enums
public enum Model has store {
    LITERATURE(u8), // 文学
    VIDEO(u8), // 视频
    PAINTING(u8), // 绘画
    EMOJI(u8), // 表情包
}
//==============================================================================================

//==============================================================================================
// Structs
public struct State has key {
    id: UID,
    fee: u64, // 手续费
    total_balance: Balance<SUI>, // 总资金
    artworks: Table<address, address>, // <artwork_address,owner_address>
    users: Table<address, u64>, // 创作者费用
    profile: Table<address, address>, // <owner_address, profile_address>
}

public struct Artwork has key, store {
    id: UID,
    name: String,
    desc: String,
    content: String, // 内容
    model: Model, // 类型
    likes: u64, // 点赞人数
    owner: address, // 作品所有者
    show: bool, // 可见性
    create_time: String, // 创建时间
    total_balace: Balance<SUI>, // 点赞总金额
}

public struct Chili_NFT has key, store {
    id: UID,
    name: String,
    desc: String,
    image: String,
    artwork: address, // 艺术品id
}

public struct Profile has key {
    id: UID,
    artworks: vector<address>,
    nfts: vector<address>,
    likes: Table<address, u64>,
}

//==============================================================================================

//==============================================================================================
// Event Structs
public struct ArtworkCreated has copy, drop {
    artwork: address,
    owner: address,
}

public struct ProfileCreated has copy, drop {
    profile: address,
    owner: address,
}

//==============================================================================================

//==============================================================================================
// Init

fun init(ctx: &mut TxContext) {
    transfer::share_object(State {
        id: object::new(ctx),
        fee: 10000000, // 手续费 0.01个sui
        total_balance: balance::zero(), // 总资金
        artworks: table::new(ctx),
        users: table::new(ctx),
        profile: table::new(ctx),
    });
}

//==============================================================================================
public entry fun create_profile(state: &mut State, ctx: &mut TxContext): address {
    let owner = tx_context::sender(ctx);
    assert!(!table::contains(&state.profile, owner), EPROFILEEXIST);
    let uid = object::new(ctx);
    let id = object::uid_to_inner(&uid);
    let new_profile = Profile {
        id: uid,
        artworks: vector::empty(),
        nfts: vector::empty(),
        likes: table::new(ctx),
    };
    let p_id = object::id_to_address(&id);
    transfer::transfer(new_profile, owner);
    table::add(&mut state.profile, owner, p_id);
    event::emit(ProfileCreated {
        profile: p_id,
        owner,
    });
    p_id
}

public entry fun create_artwork(
    name: String,
    desc: String,
    content: String,
    model: u8,
    fee: Coin<SUI>,
    create_time: String,
    state: &mut State,
    profile: &mut Profile,
    ctx: &mut TxContext,
) {
    let value = fee.value();
    assert!(value>= state.fee, FEE_FEW);
    let owner = tx_context::sender(ctx);
    let balance = coin::into_balance(fee);
    state.total_balance.join(balance);
    // 允许多次创建
    if (table::contains(&state.users, owner)) {
        let balance = table::borrow_mut(&mut state.users, owner);
        *balance = *balance + value;
    } else {
        table::add(&mut state.users, owner, value);
    };
    let uid = object::new(ctx);
    let id = object::uid_to_inner(&uid);
    let artwork = Artwork {
        id: uid,
        name: name,
        desc: desc,
        content: content,
        model: Model::LITERATURE(model),
        likes: 0,
        owner: owner,
        show: true,
        create_time: create_time,
        total_balace: balance::zero(),
    };
    let artwork_id = object::id_to_address(&id);
    state.artworks.add(artwork_id, owner);
    event::emit(ArtworkCreated { artwork: artwork_id, owner: owner });
    let image = string::utf8(
        b"https://b0.bdstatic.com/8aa98bd3ce7f08ffe542b275e87ccae5.jpg",
    );
    // 颁发NFT
    let nft_uid = object::new(ctx);
    let nft_id = object::uid_to_inner(&nft_uid);
    let nft = Chili_NFT {
        id: nft_uid,
        name: name,
        desc: desc,
        image: image,
        artwork: artwork_id,
    };
    // 记录个人信息
    profile.artworks.push_back(artwork_id);
    profile.nfts.push_back(object::id_to_address(&nft_id));
    // 对象分发出去
    share_object(artwork);
    public_transfer(nft, owner);
}

// 点赞
entry fun like(profile: &mut Profile, at: &mut Artwork, fee: Coin<SUI>) {
    assert!(fee.value()>=10000000, FEETOSMALL);
    let addr = object::id_to_address(&object::uid_to_inner(&at.id));
    assert!(!table::contains(&profile.likes, addr), USEREXISTS);
    at.likes = at.likes + 1;
    table::add(&mut profile.likes, addr, fee.value());
    at.total_balace.join(coin::into_balance(fee));
}

// 取消点赞
entry fun cancel_like(profile: &mut Profile, at: &mut Artwork, ctx: &mut TxContext) {
    let addr = object::id_to_address(&object::uid_to_inner(&at.id));
    assert!(table::contains(&profile.likes, addr), USERNOTEXISTS);
    at.likes = at.likes - 1;
    let balance = table::remove(&mut profile.likes, addr);
    public_transfer(coin::from_balance(at.total_balace.split(balance), ctx), ctx.sender());
}

public fun check_fee(state: &State, us: address): bool {
    let fee = table::borrow(&state.users, us);
    *fee >= state.fee
}

public fun check_user_true(state: &State, us: address): bool {
    table::contains(&state.users, us)
}

public entry fun set_show(at: &mut Artwork, ctx: &TxContext) {
    assert!(at.owner == ctx.sender(), USERNOTEXISTS);
    at.show = !at.show;
}

#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(ctx);
}

/*
Transaction Digest: 3MEDqjS9JRqYE7UTJgzPqcfchuUwy5LyD7Ju8hECzJGp
State ObjectID: 
0x16fd67dda7824724eac06a9ba1ea5d67a1734ed57a55b7433cb8ca0b75a6e193 
Package:
0xdc10facf3f2a30a31f745ba0c3cc9fd438437792c116ee7d99016c6d11f37cf4

*/

/*
Transaction Digest: 9AR5sUACnMXvr277Ewh1dxUVAfaoYVdBvZ6bDgsJgR4J
State ObjectID: 
0x3a62b2c3f132715534138b03cfb585214f4521238570e4090057e7d21bd4f0c0 
Package:
0xb0553572c1fd80ca02e09215c0f8f72c2ac341fe5bd6c350ab652bdc15043925




Transaction Digest: 4w3GrCmHVeJ6JX7p1rzLxrLP4q8a5p7QFnkXqWGyDd5Z
State ObjectID: 
0x405eba8232895d2bda25b5e5a69d8921864da4ab3beb837a22d9457284f5f288 
Package:
0x98d541841c76ead0dff47a6e7f6e5dcf793706ae786805b0ee3c7320599b849b


Transaction Digest: EwjVngzoHotFoEV7adtxXq9znGhLVVztp2eH9TWq6vSD
State ObjectID: 
0x0e22e53452dcb3136666edbb0344087684b6e056ed17a0ac87c0a1fca96c6aa7 
Package:
0x459fac17f58b0cd4ddfec48d9f98aeb6df7ad62afd26c5f1c476dc717cecadaf


Transaction Digest: 5CSC85RCAqNqPzkuxjHMLR7hfYjQxWTn2afBHUag7XSk
State ObjectID: 
0xe1b907ffecc8b66b09e282d4a8c957a42b9f98b8c6cb66724a4ff3eb060e84e4 
Package:
0x2bf00fba696558a28810f2fd79626edcedda4a63fa89e7fb8afed11898957309


Transaction Digest: DfFkSbewGzgkCUP5BCEuDWZCU7x69a1uUwpYz3cqgNXu
State ObjectID: 
0x8e0a6ea8b6092c8738c13d345356921a292c020406e57043be85b34023a40a0f 
Package:
0xa1ee7e9d1f443e4c9d18613fce8fda38365c2d56f8f363cdd8c4e45f88c73c7c

Transaction Digest: AMJ3RFPCV684ECpec8wLczXihsBgWD7xc1RmJ1nwXQcC
State ObjectID: 
0x4dfe302984024d2aa61b2fa8ede2aabf5cd27b3d953cbee39ec06d9aaeb750e7 
Package:
0x3be9febfda22e85bcbd9ea0e4eddc5cc9d078cfd3f7134156de0dd99aeb36a81


Transaction Digest: FdF3hs98YY5QpyUs2gBNn1Jy6YHK1DP67JBmgWBsaHv9
State ObjectID: 
0xd55aa865b6ea4967411f9fc538cfa25eacbbd38cb6f488009cadf8c25547ca50 
Package:
0xc742a6bbcbc68512bcf32893ea3eaa0d7662c88fa51be3a99de3b90a61dff9f8


Transaction Digest: GYUF4iyRCpdBVbhEkDMU34b3BeGEWkfPuMSFct3dnLoA
State ObjectID: 
0x1ba5208470509f0ec35829546bd0f6bcd0ab2a903be00078e1c20eda96db578f 
Package:
0xe4e0594e3f9f0f19f4876ce72c029b9e4fae78b267a1a12f2785f46fc1292448
*/
