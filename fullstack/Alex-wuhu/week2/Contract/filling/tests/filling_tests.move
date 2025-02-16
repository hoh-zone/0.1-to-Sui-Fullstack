
#[test_only]
module filling::filling_tests{
// uncomment this line to import the module
    use filling::filling::{Self,State,Profile,Folder};
    use sui::test_scenario::{Self};
    use sui::test_utils::assert_eq;
    use std::string;
    use sui::sui::SUI;
    const ENotImplemented: u64 = 0;
    public struct DOGE {}
    #[test]
    fun test_create_profile_create_folder_wrap_coin() {
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

        test_scenario::next_tx(scenario, user);
        {
            let mut profile = test_scenario::take_from_sender<Profile>(scenario);
            filling::create_folder(
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
            filling::add_coin_to_folder<SUI>(
                &mut folder, 
                coin,
            );
            test_scenario::return_to_sender(scenario, folder);
        };

        test_scenario::next_tx(scenario, user);
        {
            let folder = test_scenario::take_from_sender<Folder>(scenario);
            assert_eq(filling::get_balance<SUI>(&folder), 1000000);
            test_scenario::return_to_sender(scenario, folder);
        };

        test_scenario::next_tx(scenario, user);
        {
            let mut folder = test_scenario::take_from_sender<Folder>(scenario);
            let coin = sui::coin::mint_for_testing<DOGE>(
                10000000, 
                test_scenario::ctx(scenario)
            );
            filling::add_coin_to_folder<DOGE>(
                &mut folder, 
                coin,
            );
            test_scenario::return_to_sender(scenario, folder);
        };
        test_scenario::next_tx(scenario, user);
        {
            let folder = test_scenario::take_from_sender<Folder>(scenario);
            assert_eq(filling::get_balance<DOGE>(&folder), 10000000);
            test_scenario::return_to_sender(scenario, folder);
        };
        test_scenario::end(scenario_val);

    }

    #[test, expected_failure(abort_code = ::filling::filling_tests::ENotImplemented)]
    fun test_filling_fail() {
        abort ENotImplemented
    }
}
