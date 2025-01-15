#[test_only]
module admin::week_two_tests {
    use admin::week_two::{Self, State, Profile, Folder} ;
    use sui::test_scenario::{Self};
    use sui::test_utils::assert_eq;
    use std::string;
    use sui::sui::SUI;
    // use std::debug;

    public struct DOGE {}

    #[test]
    fun test_create_profile_create_folder_wrap_coin() {
        let user = @0xa;
        let mut scenario_val = test_scenario::begin(user);
        let scenario = &mut scenario_val;
        
        week_two::init_for_testing(test_scenario::ctx(scenario));
        
        test_scenario::next_tx(scenario, user);
        let name = string::utf8(b"Bob");
        let desc = string::utf8(b"degen");
        {
            let mut state = test_scenario::take_shared<State>(scenario);
            week_two::create_profile(
                name, 
                desc, 
                &mut state, 
                test_scenario::ctx(scenario)
            );
            test_scenario::return_shared(state);
        };

        test_scenario::next_tx(scenario, user);
        {
            let mut profile = test_scenario::take_from_sender<Profile>(scenario);
            week_two::create_folder(
                string::utf8(b"coins"), 
                string::utf8(b"for all useless coins"), 
                &mut profile, 
                test_scenario::ctx(scenario)
            );
            test_scenario::return_to_sender(scenario, profile);
        };

        test_scenario::next_tx(scenario, user);
        {
            let mut folder = test_scenario::take_from_sender<Folder>(scenario);
            let coin = sui::coin::mint_for_testing<SUI>(
                1000000, 
                test_scenario::ctx(scenario)
            );
            week_two::add_coin_to_folder<SUI>(
                &mut folder, 
                coin,
                test_scenario::ctx(scenario)
            );
            test_scenario::return_to_sender(scenario, folder);
        };

        test_scenario::next_tx(scenario, user);
        {
            let folder = test_scenario::take_from_sender<Folder>(scenario);
            assert_eq(week_two::get_balance<SUI>(&folder), 1000000);
            test_scenario::return_to_sender(scenario, folder);
        };

        test_scenario::next_tx(scenario, user);
        {
            let mut folder = test_scenario::take_from_sender<Folder>(scenario);
            let coin = sui::coin::mint_for_testing<DOGE>(
                10000000, 
                test_scenario::ctx(scenario)
            );
            week_two::add_coin_to_folder<DOGE>(
                &mut folder, 
                coin,
                test_scenario::ctx(scenario)
            );
            test_scenario::return_to_sender(scenario, folder);
        };

        test_scenario::next_tx(scenario, user);
        {
            let folder = test_scenario::take_from_sender<Folder>(scenario);
            assert_eq(week_two::get_balance<DOGE>(&folder), 10000000);
            test_scenario::return_to_sender(scenario, folder);
        };

        test_scenario::end(scenario_val);
    }

    // #[test, expected_failure(abort_code = ::admin::week_two_tests::ENotImplemented)]
    // fun test_week_two_fail() {
    //     abort ENotImplemented
    // }
}
