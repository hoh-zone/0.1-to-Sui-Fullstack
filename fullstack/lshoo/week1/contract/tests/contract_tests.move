
#[test_only]
module weekone::contract_tests;

use std::string;

use sui::test_scenario::{Self as ts};
use sui::test_utils::assert_eq;

use weekone::contract::{Self, State, Profile};

const Alice: address = @0xa;

#[test]
fun test_create_profile() {
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

    sc0.end();
}

/*
#[test, expected_failure(abort_code = ::contract::contract_tests::ENotImplemented)]
fun test_contract_fail() {
    abort ENotImplemented
}
*/
