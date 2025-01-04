#[test_only]
module contract::contract_tests {
    use contract::contract::{Self as week_one, State, Profile} ;
    use sui::test_scenario::{Self};
    use sui::test_utils::assert_eq;
    use std::string;
    use std::debug;

    //const ENotImplemented: u64 = 0;

    #[test]
    fun test_create_profile() {
        let user = @0xa;
        let mut scenario_val = test_scenario::begin(user);
        let scenario = &mut scenario_val;
        
        week_one::init_for_testing(test_scenario::ctx(scenario));
        
        test_scenario::next_tx(scenario, user);
        let name = string::utf8(b"Bob");
        let desc = string::utf8(b"degen");
        {
            let mut state = test_scenario::take_shared<State>(scenario);
            week_one::create_profile(
                name, 
                desc, 
                &mut state, 
                test_scenario::ctx(scenario)
            );
            test_scenario::return_shared(state);
        };

        let tx = test_scenario::next_tx(scenario, user);
        let expected_events_emitted = 1;
        assert_eq(
            test_scenario::num_user_events(&tx), 
            expected_events_emitted
        );

        {
            let state = test_scenario::take_shared<State>(scenario);
            let profile = test_scenario::take_from_sender<Profile>(scenario);
            assert!(
                week_one::check_if_has_profile(user, &state) == 
                option::some(object::id_to_address(object::borrow_id(&profile))), 
                0
            );
            debug::print(&week_one::check_if_has_profile(user, &state));
            test_scenario::return_to_sender(scenario, profile);
            test_scenario::return_shared(state);
        };

        test_scenario::end(scenario_val);
    }

    // #[test, expected_failure(abort_code = ::admin::week_one_tests::ENotImplemented)]
    // fun test_week_one_fail() {
    //     abort ENotImplemented
    // }
}

