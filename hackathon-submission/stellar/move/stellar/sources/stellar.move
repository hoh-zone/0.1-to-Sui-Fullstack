module stellar::stellar;
use std::string;
use std::string::String;
use sui::bag::add;
use sui::clock;
use sui::event;
use sui::kiosk::{owner, has_access};
use sui::table::{Self,Table};
use sui::tx_context::sender;
use sui::vec_map;
use sui::vec_set::empty;

public struct Profile has key{
    id:UID,
    name:String,
    owner:address,
}

public struct AccountBook has key{
    id:UID,
    category:String,
    content:vector<Account_content>,
    owner:address,
}

public struct Account_content has store{
    dateTime:String,
    money:u64,
    description:String,
}

public struct State has key{
    id:UID,
    users:Table<address,address>
}

public struct Account_book has key{
    id: UID,
    books:Table<address,vector<address>>
}

const EPROFILE:u64=500;

public entry fun Account_Book_create(profile:&mut Profile,catgory:String,accountTable:&mut Account_book,ctx:&mut TxContext){
    let owner=tx_context::sender(ctx);
    assert!(profile.owner==owner);
    let uid=object::new(ctx);
    let id = object::uid_to_inner(&uid);
    let acbook=AccountBook{
        id:uid,
        category:catgory,
        content:vector::empty(),
        owner:owner,
    };
    transfer::transfer(acbook,owner);
    let values = table::borrow_mut(&mut accountTable.books,owner);
    vector::push_back(values,object::id_to_address(&id));
}

public entry fun add_content(acbook:&mut AccountBook,dateTime:String,money:u64,description:String,ctx:&mut TxContext){
    let owner=tx_context::sender(ctx);
    assert!((owner==acbook.owner),0);
    let acontent=Account_content{
        dateTime,
        money,
        description,
    };
    vector::push_back(&mut acbook.content,acontent);
}

public struct ProfileCreate has copy,drop{
    id:ID,
    owner: address,
}


fun init(ctx:&mut TxContext){
    transfer::share_object(State{
        id:object::new(ctx),
        users:table::new(ctx)
    });

    transfer::share_object(Account_book{
        id:object::new(ctx),
        books:table::new(ctx)
    });
}

public entry fun create_profile(
    name:String,
    state:&mut State,
    accountTable:&mut Account_book,
    ctx:&mut TxContext
){
    let owner=tx_context::sender(ctx);
    assert!(!table::contains(&state.users,owner),EPROFILE);
    let uid=object::new(ctx);
    let id = object::uid_to_inner(&uid);
    let user_profile = Profile{
        id:uid,
        name,
        owner,
    };
    transfer::transfer(user_profile,owner);
    table::add(&mut state.users,owner,object::id_to_address(&id));
    table::add(&mut accountTable.books,owner,vector[]);
    event::emit(ProfileCreate{
        id,
        owner,
    })
}



