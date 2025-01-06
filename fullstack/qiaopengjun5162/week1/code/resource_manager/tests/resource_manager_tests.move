#[test_only]
module resource_manager::resource_manager_tests;
// uncomment this line to import the module
use resource_manager::resource_manager::{Self, State, Profile};

use sui::test_scenario;
use std::string;
use sui::test_utils::assert_eq;

#[test]
fun test_create_profile() {
    let user = @0xa; // 定义用户地址
    let mut scenario_val = test_scenario::begin(user); // 开始测试场景
    let scenario = &mut scenario_val;

    resource_manager::init_for_testing(test_scenario::ctx(scenario)); // 初始化资源管理器
    test_scenario::next_tx(scenario, user); // 进行下一笔交易
    let name = string::utf8(b"Alice"); // 用户名
    let desc = string::utf8(b"An awesome user"); // 用户描述
    {
        let mut state = test_scenario::take_shared<State>(scenario); // 获取共享状态
        resource_manager::create_profile(name, desc, &mut state, test_scenario::ctx(scenario)); // 创建用户档案
        test_scenario::return_shared(state); // 返回共享状态
    };
    let tx = test_scenario::next_tx(scenario, user); // 进行下一笔交易
    let expected_events_emitted = 1; // 预期事件数量
    assert_eq(test_scenario::num_user_events(&tx), expected_events_emitted); // 断言事件数量

    {
        let state = test_scenario::take_shared<State>(scenario); // 获取共享状态
        let profile = test_scenario::take_from_sender<Profile>(scenario); // 从发送者获取档案
        // 断言用户是否拥有档案
        assert!(resource_manager::check_if_has_profile(user, &state) == option::some(object::id_to_address(object::borrow_id(&profile))), 0); 
        test_scenario::return_shared(state); // 返回共享状态
        test_scenario::return_to_sender(scenario, profile); // 返回档案给发送者
    };

    test_scenario::end(scenario_val); // 结束测试场景
}

