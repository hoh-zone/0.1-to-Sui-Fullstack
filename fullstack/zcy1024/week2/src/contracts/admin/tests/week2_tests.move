#[test_only]
module admin::week2_tests;

use sui::test_scenario;
use sui::test_utils::assert_eq;
use std::debug;
use sui::coin;
use sui::sui::SUI;
use admin::week2::{Self, State, Profile, Folder};

#[test]
fun test_create_profile() {
    let user = @0x1024;
    let mut scenario = test_scenario::begin(user);

    week2::init_for_test(test_scenario::ctx(&mut scenario));

    let name = b"Debirth".to_string();
    let description = b"Test Desc".to_string();
    test_scenario::next_tx(&mut scenario, user);
    {
        let mut state = test_scenario::take_shared<State>(&scenario);
        week2::create_profile(name, description, &mut state, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(state);
    };

    let expected_events_number = 1;
    let tx = test_scenario::next_tx(&mut scenario, user);
    assert_eq(test_scenario::num_user_events(&tx), expected_events_number);
    {
        let state = test_scenario::take_shared<State>(&scenario);
        let profile = test_scenario::take_from_sender<Profile>(&scenario);
        assert_eq(week2::check_if_has_profile(user, &state), option::some(object::id_address(&profile)));
        debug::print(&object::id_address(&profile));
        test_scenario::return_shared(state);
        test_scenario::return_to_sender(&scenario, profile);
    };

    test_scenario::end(scenario);
}

#[test]
fun test_create_folder() {
    let user = @0x1024;
    let mut scenario = test_scenario::begin(user);

    week2::init_for_test(scenario.ctx());

    let name = b"Debirth".to_string();
    let description = b"Test Desc".to_string();
    scenario.next_tx(user);
    {
        let mut state = scenario.take_shared<State>();
        week2::create_profile(name, description, &mut state, scenario.ctx());
        test_scenario::return_shared(state);
    };

    scenario.next_tx(user);
    {
        let mut profile = scenario.take_from_sender<Profile>();
        week2::create_folder(
            b"Coin Test Folder".to_string(),
            b"for all coin type".to_string(),
            &mut profile,
            scenario.ctx()
        );
        scenario.return_to_sender(profile);
    };

    scenario.next_tx(user);
    {
        let mut folder = scenario.take_from_sender<Folder>();
        let coin = coin::mint_for_testing<SUI>(666666666, scenario.ctx());
        folder.add_coin_to_folder<SUI>(coin);
        scenario.return_to_sender(folder);
    };

    scenario.next_tx(user);
    {
        let folder = scenario.take_from_sender<Folder>();
        assert_eq(folder.get_balance<SUI>(), 666666666);
        scenario.return_to_sender(folder);
    };

    scenario.end();
}