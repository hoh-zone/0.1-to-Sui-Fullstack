
#[test_only]
module filling::filling_tests{
// uncomment this line to import the module
    use filling::filling::{Self,State,Profile};
    use sui::test_scenario::{Self};
    use std::string::{Self,String};
    use sui::test_utils::assert_eq;
    const ENotImplemented: u64 = 0;

    #[test]
    fun test_create_profile() {
        let user = @0xa;
        let mut scenario_val = test_scenario::begin(user);
        let scenario = &mut scenario_val;
        filling::init_for_testing(test_scenario::ctx(scenario));
        test_scenario::next_tx(scenario,user);
        let name = string::utf8(b"Alex");
        let desc = string::utf8(b"Beginner");
        {
            let mut state = test_scenario::take_shared<State>(scenario);
            filling::create_profile(
                name,
                desc,
                &mut state,
                test_scenario::ctx(scenario)
            );
            test_scenario::return_shared(state);
        
        };
        let tx = test_scenario::next_tx(scenario,user);
        let expected_no_events = 1;
        assert_eq(test_scenario::num_user_events(&tx),expected_no_events);
        {
            let state = test_scenario::take_shared<State>(scenario);
            let profile = test_scenario::take_from_sender<Profile>(scenario);
            assert!(
                filling::check_if_has_profile(user,&state) ==
                option::some(object::id_to_address(object::borrow_id(&profile))),
                0
            );
            test_scenario::return_shared(state);
            test_scenario::return_to_sender(scenario,profile);
        };
        test_scenario::end(scenario_val);


    }

    #[test, expected_failure(abort_code = ::filling::filling_tests::ENotImplemented)]
    fun test_filling_fail() {
        abort ENotImplemented
    }
}
