module passwordmanager::passwordmanager;
use std::string::String;
use sui::event::{Self};
use sui::object::{Self, UID};

public struct Password has key, store{
    id: UID,
    website: String,
    username: String,
    pw: String,
    iv: String,
    salt: String,
}

public struct AddPasswordEvent has copy, drop {
    pid: ID,
    website: String,
    username: String,
    owner: address,
}

public struct ChangePasswordEvent has copy, drop {
    pid: ID,
    website: String,
    username: String,
    owner: address,
}

public struct DeletePasswordEvent has copy, drop {
    pid: ID,
    website: String,
    username: String,
    owner: address,
}
fun init(_ctx : &mut TxContext){
}
public entry fun add_password(website: String,username : String, pw : String, iv : String, salt : String, ctx : &mut TxContext){
    let pw = Password {
        id: object::new(ctx),
        website,
        username,
        pw,
        iv,
        salt,
    };
    let pa_id = object::uid_to_inner(&pw.id);
    transfer::public_transfer(pw, ctx.sender());
    event::emit(AddPasswordEvent {
        pid: pa_id,
        website,
        username,
        owner: ctx.sender(),
    })
}

public entry fun change_password(
    password: &mut Password, 
    new_pw: String,
    new_iv: String,
    new_salt: String,
    ctx: &mut TxContext
) {
    // 更新密码相关信息
    password.pw = new_pw;
    password.iv = new_iv;
    password.salt = new_salt;

    // 发出密码修改事件
    event::emit(ChangePasswordEvent {
        pid: object::uid_to_inner(&password.id),
        website: password.website,
        username: password.username,
        owner: tx_context::sender(ctx),
    });
}

public entry fun delete_password(password: Password, ctx: &mut TxContext) {
    // 在删除对象前发出删除事件
    event::emit(DeletePasswordEvent {
        pid: object::uid_to_inner(&password.id),
        website: password.website,
        username: password.username,
        owner: tx_context::sender(ctx),
    });

    // 删除密码对象
    let Password { id, website: _, username: _, pw: _, iv: _, salt: _ } = password;
    object::delete(id);
}

