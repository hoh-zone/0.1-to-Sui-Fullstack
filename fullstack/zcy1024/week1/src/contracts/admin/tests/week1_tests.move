#[test_only]
module admin::week1_tests;

use sui::test_scenario;
use sui::test_utils::assert_eq;
use std::debug;
use admin::week1::{Self, State, Profile};

#[test]
fun test_create_profile() {
    let user = @0x1024;
    let mut scenario = test_scenario::begin(user);

    week1::init_for_test(test_scenario::ctx(&mut scenario));

    let name = b"Debirth".to_string();
    let description = b"Test Desc".to_string();
    test_scenario::next_tx(&mut scenario, user);
    {
        let mut state = test_scenario::take_shared<State>(&scenario);
        week1::create_profile(name, description, &mut state, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(state);
    };

    let expected_events_number = 1;
    let tx = test_scenario::next_tx(&mut scenario, user);
    assert_eq(test_scenario::num_user_events(&tx), expected_events_number);
    {
        let state = test_scenario::take_shared<State>(&scenario);
        let profile = test_scenario::take_from_sender<Profile>(&scenario);
        assert_eq(week1::check_if_has_profile(user, &state), option::some(object::id_address(&profile)));
        debug::print(&object::id_address(&profile));
        test_scenario::return_shared(state);
        test_scenario::return_to_sender(&scenario, profile);
    };

    test_scenario::end(scenario);
}