#[test_only]
module filling::filling_tests {
    // uncomment this line to import the module
    use std::option;
    use filling::filling::{State, Self, Profile};
    use sui::test_scenario::{Self};
    use std::string::{Self, String};
    use sui::object;
    use sui::test_utils::assert_eq;

    #[test]
    // 测试是否能够成功create 一个 object
    fun text_create_profile() {
        let user: address = @0xa;
        let mut scenario_val = test_scenario::begin(user);
        let scenario = &mut scenario_val;
        // 初始化
        filling::init_for_testing(test_scenario::ctx(scenario));
        test_scenario::next_tx(scenario, user);
        let name = string::utf8(b"BOB");
        let desc = string::utf8(b"PR programmer");
        {
            // init 之后就由state
            let mut state = test_scenario::take_shared<State>(scenario);
            filling::create_profile(
                name,
                desc,
                &mut state,
                test_scenario::ctx(scenario)
            );
            // take shate 之后要还回去，不然就会一直在，不会被 drop 掉，且测试的时候就会报错
            test_scenario::return_shared(state);
        };
        // 测试，确认是否 create object
        let tx = test_scenario::next_tx(scenario, user);
        // create_profile 创建了一次，events 就是1
        let expected_no_events = 1;
        assert_eq(
            // 校验 event 由多少个
            test_scenario::num_user_events(&tx),
            expected_no_events
        );
        // 测试是否creat这个  profile object

        {
            let state = test_scenario::take_shared<State>(scenario);
            let profile = test_scenario::take_from_sender<Profile>(scenario);
            assert!(
                filling::check_if_has_profile(user,&state)
                    == option::some(object::id_to_address(object::borrow_id(&profile))),
                // error code
                0
            );
            // 借了的 object 要还回去
            test_scenario::return_shared(state);
            test_scenario::return_to_sender(scenario,profile);
        };
        // 结束整个 test
        test_scenario::end(scenario_val);
    }
}


