module contract::contract;

use std::string::{String};
use sui::event;
use sui::table::{Self,Table};
use sui::object;
use sui::transfer;
use sui::tx_context;
use sui::coin::{Self,Coin};
use std::ascii::{String as AString};
use std::type_name;
use std::type_name::TypeName;
use sui::balance::Balance;
use sui::dynamic_field;


//Error
const EProfileExist : u64 = 1;

//Struct
public struct Profile has key{
    id:UID,
    name:String,
    description:String,
    floder:vector<address>//floder
}

public struct State has key{
    id:UID,
    users:Table<address,address>
    //owner,profile
}

public struct Floder has key{
    id:UID,
    name: String,
    description:String
    //dynamicfield
}

//Event
public struct ProfileCreated has copy,drop{
    profile:address,
    owner:address
}

public struct FloderCreated has copy,drop{
    id:ID,
    owner:address
}

public struct CoinWrapped has copy,drop{
    floder:address,
    coin_type: AString,
    amount:u64,
    new_balance:u64
}

//function

fun init(ctx: &mut TxContext){
    let state = State{
        id: object::new(ctx),
        users: table::new(ctx)
    };
    transfer::share_object(state);
}


public entry fun creat_profile(state: &mut State,name:String,description:String,ctx:&mut TxContext){
    let uid = object::new(ctx);
    let owner = ctx.sender();
    assert!(!table::contains(&state.users, owner),EProfileExist);
    let id = object::uid_to_inner(&uid);
    let profile =Profile{
        id: uid,
        name,
        description,
        floder: vector::empty()
    };

    transfer::transfer(profile,owner);
    table::add(&mut state.users,owner,object::id_to_address(&id));
    event::emit(ProfileCreated{
        profile: object::id_to_address(&id),
        owner,
    });
}

//profile已经传递给了owner，因此这里有个潜规则是只有owner才能传进来
public fun create_floder(profile: &mut Profile,name:String, description:String,ctx:&mut TxContext){
    let owner = tx_context::sender(ctx);
    let uid = object::new(ctx);
    let id = object::uid_to_inner(&uid);
    let new_floder = Floder{
        id:uid,
        name,
        description
    };
    transfer::transfer(new_floder,owner);
    vector::push_back(&mut profile.floder,object::id_to_address(&id));
    event::emit(FloderCreated{
        id,
        owner
    });
}

public fun addCoinToFloder<T>(floder:&mut Floder, coin:Coin<T>, ctx:&mut TxContext){
    let typeName = type_name::get<T>();
    let amount = coin::value(&coin);
    let total;
    if(!dynamic_field::exists_(&floder.id,typeName)){
        //dynamic field
        dynamic_field::add(&mut floder.id,typeName,coin::into_balance(coin));
        total = amount;
    }else{
        //取出原来的金额
        let old_value = dynamic_field::borrow_mut<TypeName,Balance<T>>(&mut floder.id,typeName);
        old_value.join(coin::into_balance(coin));
        total = old_value.value();
    };
    event::emit(CoinWrapped{
        floder: object::uid_to_address(&floder.id),
        coin_type: typeName.into_string(),
        amount,
        new_balance:total
    });
}



//检查是否存在，如果存在则返回一个Profile的地址
public fun check_is_profile(user_address:address,state:&State):Option<address>{
    if (table::contains(&state.users, user_address)) {
        option::some(*table::borrow(&state.users, user_address))
    } else {
        option::none()
    }
}

//getter
public fun get_banlance<T>(folder: &Floder):u64{
    if(dynamic_field::exists_(&folder.id,type_name::get<T>())){
        dynamic_field::borrow<TypeName,Balance<T>>(&folder.id,type_name::get<T>()).value()
    }else{
        0
    }
}


//helper fun
#[test_only]
public fun init_testing(ctx:&mut TxContext){
    init(ctx);
}