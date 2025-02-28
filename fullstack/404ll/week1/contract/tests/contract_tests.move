
#[test_only]
module contract::contract_tests;
    use contract::contract;
    use sui::test_scenario::{Self};
    use std::string::{Self};
    use sui::test_utils::assert_eq;
    use contract::contract::{State, Profile};

#[test]
fun test_create_Profile() {
    // 初始化合约时并执行测试场景
    let user = @0x123;
    let mut scenario_val = test_scenario::begin(user);
    let scenario = &mut scenario_val;
    contract::init_testing(test_scenario::ctx(scenario));
    test_scenario::next_tx(scenario,user);
    // 进行测试
    let name = string::utf8(b"Ele");
    let description = string::utf8(b"a good people");
    {
        let mut state = test_scenario::take_shared<State>(scenario);
        contract::creat_profile(
            &mut state,
            name,
            description,
            test_scenario::ctx(scenario)
        );
    //借用之后需要还回去
        test_scenario::return_shared(state);
    };
    //验证事件是否正确
    let tx = test_scenario::next_tx(scenario,user);
    let expected_num_event :u64 = 1;
    assert_eq(
        test_scenario::num_user_events(&tx),
        expected_num_event
    );

    //验证是否生成了Profile
    {
        let state = test_scenario::take_shared<State>(scenario);
        let profile = test_scenario::take_from_sender<Profile>(scenario);
        assert!(
            contract::check_is_profile(user,&state)
                ==
                option::some(object::id_to_address(object::borrow_id(&profile))),
            0
        );
        //归还借出的object
        test_scenario::return_shared(state);
        test_scenario::return_to_sender(scenario,profile);
    };

    //结束测试场景
    test_scenario::end(scenario_val);
}


