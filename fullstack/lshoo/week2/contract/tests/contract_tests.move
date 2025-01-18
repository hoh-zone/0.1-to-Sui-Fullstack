
#[test_only]
module weektwo::contract_tests;

use std::string;

use sui::sui::SUI;

use sui::test_scenario::{Self as ts};
use sui::test_utils::assert_eq;

use weektwo::contract::{Self, State, Profile, Folder};

const Alice: address = @0xa;

public struct BTC {}

#[test]
fun test_create_profile_folder_wrap_coin() {
    let mut sc0 = ts::begin(Alice);
    let sc = &mut sc0;

    let name = string::utf8(b"Alice");
    let desc = string::utf8(b"James Bond");

    contract::init_for_testing(ts::ctx(sc));

    // Create Profile
    ts::next_tx(sc, Alice);
    
    let mut state = ts::take_shared<State>(sc);

    let profile_address = state.create_profile_api(name, desc, sc.ctx());

    ts::return_shared(state);

    // Check ProfileCreated event
    let tx_effect = sc.next_tx(Alice);
    { 
        assert_eq(
            ts::num_user_events(&tx_effect),
            1
        );
    };

    // Check profile
    sc.next_tx(Alice);
    {
        let profile = ts::take_from_sender<Profile>(sc);
        let state = ts::take_shared<State>(sc);

        assert_eq(
            state.get_profile_by_owner(Alice),
            option::some(profile_address)
        );

        assert_eq(profile.get_address(), profile_address);
        assert_eq(profile.get_name(), name);
        assert_eq(profile.get_description(), desc);

        ts::return_to_sender(sc, profile);
        ts::return_shared(state);
    };

    // Create folder
    sc.next_tx(Alice);
    { 
        let mut profile = ts::take_from_sender<Profile>(sc);
        contract::create_folder_api(
            string::utf8(b"SuiCoin"), 
            string::utf8(b"test profile"), 
            &mut profile, 
            sc.ctx()
        );
        ts::return_to_sender(sc, profile);
    };

    let coin = sui::coin::mint_for_testing<SUI>(1000000, sc.ctx());

    // Wrap coin to folder
    sc.next_tx(Alice);
    {
        let mut folder = ts::take_from_sender<Folder>(sc);
        contract::add_coin_to_folder<SUI>(&mut folder, coin, sc.ctx());
        ts::return_to_sender(sc, folder);
    };

    // Check balance
    sc.next_tx(Alice);
    {
        let folder = ts::take_from_sender<Folder>(sc);
        assert_eq(contract::get_balance<SUI>(&folder), 1000000);
        ts::return_to_sender(sc, folder);
    };

    // Mint BTC
    sc.next_tx(Alice);
    {
        let mut folder = ts::take_from_sender<Folder>(sc);
        let coin = sui::coin::mint_for_testing<BTC>(1000000, sc.ctx());
        contract::add_coin_to_folder<BTC>(&mut folder, coin, sc.ctx());
        ts::return_to_sender(sc, folder);
    };

    // Check BTC balance
    sc.next_tx(Alice);
    {
        let folder = ts::take_from_sender<Folder>(sc);
        assert_eq(contract::get_balance<BTC>(&folder), 1000000);
        ts::return_to_sender(sc, folder);
    };

    sc0.end();
}

/*
#[test, expected_failure(abort_code = ::contract::contract_tests::ENotImplemented)]
fun test_contract_fail() {
    abort ENotImplemented
}
*/
