#[test_only]
module sui_resource_mange::sui_resource_mange_tests {
    use sui_resource_mange::sui_resource_mange::{Self, State, Profile} ;
    use sui::test_scenario::{Self};
    use sui::test_utils::assert_eq;
    use std::string;
    use std::debug;

    #[test]
    fun test_create_profile() {
        let user = @0xa;
        let mut scenario_val = test_scenario::begin(user);
        let scenario = &mut scenario_val;
        
        sui_resource_mange::init_for_testing(test_scenario::ctx(scenario));
        
        test_scenario::next_tx(scenario, user);
        let name = string::utf8(b"Bob");
        let desc = string::utf8(b"degen");
        {
            let mut state = test_scenario::take_shared<State>(scenario);
            sui_resource_mange::create_profile(
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
                sui_resource_mange::check_if_has_profile(user, &state) == 
                option::some(object::id_to_address(object::borrow_id(&profile))), 
                0
            );
            debug::print(&sui_resource_mange::check_if_has_profile(user, &state));
            test_scenario::return_to_sender(scenario, profile);
            test_scenario::return_shared(state);
        };

        test_scenario::end(scenario_val);
    }
}
