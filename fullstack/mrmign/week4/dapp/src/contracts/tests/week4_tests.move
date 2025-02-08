#[test_only]
module admin::week4_tests;

use sui::test_scenario;
use sui::test_utils::assert_eq;
use std::debug;
use sui::coin;
use sui::sui::SUI;
use admin::week4::{Self, State, Profile, Folder};
use admin::nft::{Self, Pet, Toy, Accessory};

#[test]
fun test_create_profile() {
    let user = @0x1024;
    let mut scenario = test_scenario::begin(user);

    week4::init_for_test(test_scenario::ctx(&mut scenario));

    let name = b"Debirth".to_string();
    let description = b"Test Desc".to_string();
    test_scenario::next_tx(&mut scenario, user);
    {
        let mut state = test_scenario::take_shared<State>(&scenario);
        week4::create_profile(name, description, &mut state, test_scenario::ctx(&mut scenario));
        test_scenario::return_shared(state);
    };

    let expected_events_number = 1;
    let tx = test_scenario::next_tx(&mut scenario, user);
    assert_eq(test_scenario::num_user_events(&tx), expected_events_number);
    {
        let state = test_scenario::take_shared<State>(&scenario);
        let profile = test_scenario::take_from_sender<Profile>(&scenario);
        assert_eq(week4::check_if_has_profile(user, &state), option::some(object::id_address(&profile)));
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

    week4::init_for_test(scenario.ctx());

    let name = b"Debirth".to_string();
    let description = b"Test Desc".to_string();
    scenario.next_tx(user);
    {
        let mut state = scenario.take_shared<State>();
        week4::create_profile(name, description, &mut state, scenario.ctx());
        test_scenario::return_shared(state);
    };

    scenario.next_tx(user);
    {
        let mut profile = scenario.take_from_sender<Profile>();
        week4::create_folder(
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
        let mut folder = scenario.take_from_sender<Folder>();
        assert_eq(folder.get_balance<SUI>(), 666666666);
        let coin = week4::remove_coin_from_folder<SUI>(&mut folder, scenario.ctx());
        scenario.return_to_sender(folder);
        transfer::public_transfer(coin, user);
    };

    scenario.end();
}

#[test]
fun test_nft_module() {
    let user = @0x1024;
    let mut scenario = test_scenario::begin(user);

    week4::init_for_test(scenario.ctx());

    let name = b"Debirth".to_string();
    let description = b"Test Desc".to_string();
    scenario.next_tx(user);
    {
        let mut state = scenario.take_shared<State>();
        week4::create_profile(name, description, &mut state, scenario.ctx());
        test_scenario::return_shared(state);
    };

    scenario.next_tx(user);
    {
        let mut profile = scenario.take_from_sender<Profile>();
        week4::create_folder(
            b"NFT Folder".to_string(),
            b"NFT Folder Desc".to_string(),
            &mut profile,
            scenario.ctx()
        );
        scenario.return_to_sender(profile);
    };

    scenario.next_tx(user);
    {
        nft::mint_nft(
            b"Pet".to_string(),
            b"Pet Desc".to_string(),
            b"Pet".to_string(),
            b"Pet Image".to_string(),
            scenario.ctx()
        );
        nft::mint_nft(
            b"Toy".to_string(),
            b"Toy Desc".to_string(),
            b"Toy".to_string(),
            b"Toy Image".to_string(),
            scenario.ctx()
        );
        nft::mint_nft(
            b"Accessory".to_string(),
            b"Accessory Desc".to_string(),
            b"Accessory".to_string(),
            b"Accessory Image".to_string(),
            scenario.ctx()
        );
    };

    let tx = scenario.next_tx(user);
    assert_eq(tx.num_user_events(), 3);
    let first_toy_id;
    {
        let mut pet = scenario.take_from_sender<Pet>();
        let toy = scenario.take_from_sender<Toy>();
        let accessory = scenario.take_from_sender<Accessory>();
        first_toy_id = object::id(&toy);
        nft::add_toy_or_accessory<Toy>(toy, &mut pet, scenario.ctx());
        nft::add_toy_or_accessory<Accessory>(accessory, &mut pet, scenario.ctx());
        scenario.return_to_sender(pet);
        nft::mint_nft(
            b"Toy".to_string(),
            b"Toy Desc".to_string(),
            b"Toy".to_string(),
            b"Toy Image".to_string(),
            scenario.ctx()
        );
    };

    let tx = scenario.next_tx(user);
    assert_eq(tx.num_user_events(), 1);
    {
        let mut pet = scenario.take_from_sender<Pet>();
        let toy = scenario.take_from_sender<Toy>();
        nft::add_toy_or_accessory<Toy>(toy, &mut pet, scenario.ctx());
        scenario.return_to_sender(pet);
    };

    scenario.next_tx(user);
    {
        let toy = scenario.take_from_sender<Toy>();
        debug::print(&object::id(&toy));
        debug::print(&first_toy_id);
        assert_eq(object::id(&toy), first_toy_id);
        scenario.return_to_sender(toy);
    };

    scenario.next_tx(user);
    {
        let pet = scenario.take_from_sender<Pet>();
        assert_eq(nft::check_if_pet_carries_toy_or_accessory<Toy>(&pet), true);
        assert_eq(nft::check_if_pet_carries_toy_or_accessory<Accessory>(&pet), true);
        scenario.return_to_sender(pet);
    };

    scenario.end();
}

#[test]
fun test_wrap_nft() {
    let user = @0x1024;
    let mut scenario = test_scenario::begin(user);

    week4::init_for_test(scenario.ctx());

    let name = b"Debirth".to_string();
    let description = b"Test Desc".to_string();
    scenario.next_tx(user);
    {
        let mut state = scenario.take_shared<State>();
        week4::create_profile(name, description, &mut state, scenario.ctx());
        test_scenario::return_shared(state);
    };

    scenario.next_tx(user);
    {
        let mut profile = scenario.take_from_sender<Profile>();
        week4::create_folder(
            b"NFT Folder".to_string(),
            b"NFT Folder Desc".to_string(),
            &mut profile,
            scenario.ctx()
        );
        scenario.return_to_sender(profile);
    };

    scenario.next_tx(user);
    {
        nft::mint_nft(
            b"Pet".to_string(),
            b"Pet Desc".to_string(),
            b"Pet".to_string(),
            b"Pet Image".to_string(),
            scenario.ctx()
        );
    };

    let nft_add;
    scenario.next_tx(user);
    {
        let mut folder = scenario.take_from_sender<Folder>();
        let pet = scenario.take_from_sender<Pet>();
        nft_add = object::id(&pet).to_address();
        week4::add_nft_to_folder<Pet>(&mut folder, pet);
        scenario.return_to_sender(folder);
    };

    scenario.next_tx(user);
    {
        let folder = scenario.take_from_sender<Folder>();
        assert_eq(week4::check_if_obj_exists_in_folder(&folder, nft_add), true);
        scenario.return_to_sender(folder);
    };

    scenario.end();
}

#[test]
fun test_subfolder_and_remove() {
    let user = @0x1024;
    let mut scenario = test_scenario::begin(user);

    week4::init_for_test(scenario.ctx());

    let name = b"Debirth".to_string();
    let description = b"Test Desc".to_string();
    scenario.next_tx(user);
    {
        let mut state = scenario.take_shared<State>();
        week4::create_profile(name, description, &mut state, scenario.ctx());
        test_scenario::return_shared(state);
    };

    scenario.next_tx(user);
    {
        let mut profile = scenario.take_from_sender<Profile>();
        week4::create_folder(
            b"SubFolder".to_string(),
            b"test if can be wrapped".to_string(),
            &mut profile,
            scenario.ctx()
        );
        week4::create_folder(
            b"Folder Father".to_string(),
            b"test if can wrap subfolder".to_string(),
            &mut profile,
            scenario.ctx()
        );
        scenario.return_to_sender(profile);
    };

    scenario.next_tx(user);
    let subfolder_add: address;
    {
        let mut folder = scenario.take_from_sender<Folder>();
        let subfolder = scenario.take_from_sender<Folder>();
        subfolder_add = object::id(&subfolder).to_address();
        week4::add_subfolder_to_folder(&mut folder, subfolder);
        scenario.return_to_sender(folder);
    };

    let tx = scenario.next_tx(user);
    assert_eq(tx.num_user_events(), 1);
    {
        let mut folder = scenario.take_from_sender<Folder>();
        assert_eq(week4::get_exist_subfolder_name(&folder, subfolder_add), b"SubFolder".to_string());
        let subfolder = week4::remove_subfolder_from_folder(&mut folder, subfolder_add);
        scenario.return_to_sender(folder);
        transfer::public_transfer(subfolder, user);
    };

    scenario.end();
}