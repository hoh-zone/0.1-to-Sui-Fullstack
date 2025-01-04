module profile::week_one;

use std::string::String;
use sui::event;
use sui::object::uid_to_inner;
use sui::table::{Self, Table};

// 错误码定义
const EProfileExist: u64 = 0;

// UserProfile 结构体
public struct Profile has key {
  id: UID,
  name: String,
  description: String,
}

public struct ProfileCreatedEvent has copy, drop {
  profile_id: ID,
  owner: address,
}

// 用户信息表
public struct UserServer has key {
  id: UID,
  users: Table<address, ID>,
}

fun init(ctx: &mut TxContext) {
  transfer::share_object(UserServer {
    id: object::new(ctx),
    users: table::new(ctx),
  });
}

// 创建用户信息
public entry fun create_profile(
  name: String,
  description: String,
  state: &mut UserServer,
  ctx: &mut TxContext,
) {
  assert!(!table::contains(&state.users, tx_context::sender(ctx)), EProfileExist);
  let profile = Profile {
    id: object::new(ctx),
    name,
    description,
  };
  table::add(&mut state.users, tx_context::sender(ctx), uid_to_inner(&profile.id));
  event::emit(ProfileCreatedEvent {
    profile_id: uid_to_inner(&profile.id),
    owner: tx_context::sender(ctx),
  });
  transfer::transfer(profile, tx_context::sender(ctx));
}

// 判断是否存在用户信息
public fun is_profile_exist(state: &UserServer, user_address: address): Option<ID> {
  if (table::contains(&state.users, user_address)) {
    option::some(*table::borrow(&state.users, user_address))
  } else {
    option::none()
  }
}



