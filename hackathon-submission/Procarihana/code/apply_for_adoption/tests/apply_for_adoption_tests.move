#[test_only]
module apply_for_adoption::apply_for_adoption_tests {

    const ENotImplemented: u64 = 0;
    //==============================================================================================
    // Dependencies
    //==============================================================================================
    use sui::test_scenario::{Self, Scenario};
    // uncomment this line to import the module
    use apply_for_adoption::apply_for_adoption::{
        Self,
        init_for_testing,
        get_record_status,
        abendon_adopt_contract,
        unusual_adopt_contract,
        get_contract,
        create_adopt_contract,
        sign_adopt_contract,
        get_unchange_contract,
        AUDIT_EXCEPTION,
        get_in_force_status,
        get_contract_records,
        get_contract_status,
        get_x_id,
        get_audit_pass_times,
        REPEAT_UPLOAD_EXCEPTION,
        upload_record,
        audit_record,
        AdoptContract,
        AdoptContracts,
        PublicUid,
        get_contrac_id,
        FINISH_STATUS_ERROR, ERROR_ADDRESS,
        destory_adopt_contact,
        NOT_EXSIT_CONTRACT, DESTORY_ERROR_CONTRACT, ADOPTED_EXCEPTION, UNSUAL_ERROR
    };
    use sui::coin::{Coin, Self};
    use std::string::{String, Self};
    use sui::clock::{Clock, Self};
    use sui::sui::SUI;
    use std::vector::{Self, length, empty, push_back};
    use sui_system::sui_system::{Self, SuiSystemState, request_add_stake_non_entry, request_withdraw_stake_non_entry};
    use sui_system::governance_test_utils::{advance_epoch, set_up_sui_system_state};
    use sui::test_utils::{Self};

    //==============================================================================================
    // Error codes
    //==============================================================================================
    #[allow(unused_const)]
    const CREATE_SIGN_ADOPT_CONTRACT_ERROR: u64 = 201;
    // test_upload_contract
    #[allow(unused_const)]
    const UPLOAD_CONTRACT_ERROR: u64 = 202;
    const E_RECORD_TIMES_ERROR: u64 = 203;
    // 审核结果异常
    const E_RECORD_RESULT_ERROR: u64 = 204;
    const E_RECORD_RESULT_STATUS: u64 = 205;
    //==============================================================================================
    // test
    //==============================================================================================

    #[test]
    /// 平台-测试创建合约
    fun test_create_adopt_contract() {
        // 平台
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());

        // 初始化平台
        init_for_testing(platfrom_scenario.ctx());
        platfrom_scenario.next_tx(get_platform_address());
        // 合同集合
        let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
        // 创建合同
        create_adopt_contract_fun(get_test_x_id(), get_test_animal_id(), &mut contracts
            , get_twice_record_times(), get_user_address(), platfrom_scenario.ctx());
        // 从平台校验是否能获取到新增的合同
        let contract = get_contract(&mut contracts, get_test_animal_id(), get_test_x_id());
        assert!(get_x_id(contract) == get_test_x_id(), 100);
        test_scenario::return_shared(contracts);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
    }

    #[test]
    #[expected_failure(abort_code = ADOPTED_EXCEPTION)]
    /// 平台-测试被领养了的动物不能生成领养合同
    fun test_create_adopted_animal_contract() {
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);
        // 平台-创建合同
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let contracts: AdoptContracts = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_twice_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            contracts
        };
        // 用户-签署测试合同
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );

            // 校验合同状态为已生效
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            assert!(get_contract_status(contract) == get_in_force_status(), CREATE_SIGN_ADOPT_CONTRACT_ERROR);
        };
        // 同一个动物再生成合约
        {
            // 创建合同
            create_adopt_contract_fun(
                get_error_test_x_id(),
                get_test_animal_id(),
                &mut contracts_ref,
                get_twice_record_times(),
                get_error_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
        };
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束测试
        test_scenario::end(platfrom_scenario);
        // 结束用户
        test_scenario::end(user_scenario_new_ref);
        test_scenario::end(scenario_val);
    }

    #[test]
    #[expected_failure(abort_code = UNSUAL_ERROR)]
    /// 平台-测试有异常状态合同用户的不能生成
    fun test_create_unusual_user_contract() {
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);
        // 平台-创建合同
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let contracts: AdoptContracts = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_twice_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            contracts
        };
        // 用户-签署测试合同
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );

            // 校验合同状态为已生效
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            assert!(get_contract_status(contract) == get_in_force_status(), CREATE_SIGN_ADOPT_CONTRACT_ERROR);
        };
        {
            // 平台-判断用户异常
            unusual_adopt_contract(
                get_test_animal_id(),
                get_test_x_id(),
                &mut contracts_ref,
                string::utf8(b"not uplop record and no reason!"),
                &mut system_state,
                platfrom_scenario.ctx()
            );
        };
        {
            // 平台-为该用户生成新的合同
            platfrom_scenario.next_tx(get_platform_address());
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts_ref,
                get_twice_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
        };
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束测试
        test_scenario::end(platfrom_scenario);
        // 结束用户
        test_scenario::end(user_scenario_new_ref);
        test_scenario::end(scenario_val);
    }

    #[test]
    /// 用户-测试签署合约
    fun test_sign_adopt_contract() {
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);
        // 平台-创建合同
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_twice_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };

        // 用户-签署测试合同
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );

            // 校验合同状态为已生效
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            assert!(get_contract_status(contract) == get_in_force_status(), CREATE_SIGN_ADOPT_CONTRACT_ERROR);
        };
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束测试
        test_scenario::end(platfrom_scenario);
        // 结束用户
        test_scenario::end(user_scenario_new_ref);
        test_scenario::end(scenario_val);
    }

    #[test]
    #[expected_failure(abort_code = ERROR_ADDRESS)]
    /// 用户-测测试非用户签约
    fun test_error_user_sign_adopt_contract() {
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);
        // 平台-创建合同
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_twice_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };
        // 用户-签署测试合同
        let mut error_user_scenario = test_scenario::begin(get_error_user_address());
        let (contract_id, coin, user_scenario_new) = {
            error_user_scenario.next_tx(get_error_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, error_user_scenario, get_error_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );
            // 校验合同状态为已生效
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            assert!(get_contract_status(contract) == get_in_force_status(), CREATE_SIGN_ADOPT_CONTRACT_ERROR);
        };
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束测试
        test_scenario::end(platfrom_scenario);
        // 结束用户
        test_scenario::end(user_scenario_new_ref);
        test_scenario::end(scenario_val);
    }

    #[test]
    /// 用户-上传记录
    fun test_upload_contract() {
        // 平台-创建合同
        // 平台
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);

        // 平台-创建合同
        // 平台
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_twice_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };

        // 用户-签署测试合同
        // 用户
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );

            // 校验合同状态为已生效
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            // 用户-上传记录
            get_contrac_id(contract)
        };
        let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
        upload_record(contract_id, &mut contracts_ref, get_pic(),
            &clock, user_scenario_new_ref.ctx());
        // 获取合同
        let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(),
            get_test_x_id());
        // 校验是否存在记录
        let records = get_contract_records(contract);
        assert!(!vector::is_empty(&records), UPLOAD_CONTRACT_ERROR);
        // 销毁 clock
        clock::destroy_for_testing(clock);
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
        // 结束用户测试
        test_scenario::end(user_scenario_new_ref);
        // 结束获取测试结果测试
        test_scenario::end(scenario_val);
    }

    #[test]
    #[expected_failure(abort_code = ERROR_ADDRESS)]
    /// 用户-测试非用户上传记录
    fun test_error_user_upload_contract() {
        // 平台-创建合同
        // 平台
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);

        // 平台-创建合同
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_twice_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };

        // 用户-签署测试合同
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );

            // 校验合同状态为已生效
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            // 用户-上传记录
            get_contrac_id(contract)
        };
        // 错误用户上传记录
        {
            let mut error_user_scenario = test_scenario::begin(get_error_user_address());
            let clock = clock::create_for_testing(error_user_scenario.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(), &clock, error_user_scenario.ctx());
            // 销毁 clock
            clock::destroy_for_testing(clock);
            test_scenario::end(error_user_scenario);
        };

        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
        // 结束用户测试
        test_scenario::end(user_scenario_new_ref);
        // 结束获取测试结果测试
        test_scenario::end(scenario_val);
    }

    #[test]
    /// 平台-审核通过上传记录
    fun test_audit_record() {
        // 平台-创建合同
        // 平台
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);

        // 平台-创建合同
        // 平台
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_twice_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };

        // 用户-签署测试合同
        // 用户
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );

            // 校验合同状态为已生效
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            // 用户-上传记录
            get_contrac_id(contract)
        };
        let contract_id: ID = {
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 获取合同
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(),
                get_test_x_id());
            // 销毁 clock
            clock::destroy_for_testing(clock);
            // 用户-上传记录
            get_contrac_id(contract)
        };

        // 平台-审核通过上传记录
        audit_record(contract_id, &mut contracts_ref, true, string::utf8(b"well down!")
            , &mut system_state,  platfrom_scenario.ctx());
        // 获取合同
        let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(),
            get_test_x_id());
        // 测试审核次数为1
        assert!(get_audit_pass_times(contract) == 1, E_RECORD_TIMES_ERROR);
        let mut records = get_contract_records(contract);
        // 测试审核状态为通过
        let record = vector::pop_back(&mut records);
        let record_status = get_record_status(&record);
        assert!(record_status == true, E_RECORD_RESULT_ERROR);
        // 测试合约状态为生效中
        let contract_status = get_contract_status(contract);
        assert!(contract_status == 1, E_RECORD_RESULT_STATUS);
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
        // 结束用户测试
        test_scenario::end(user_scenario_new_ref);
        // 结束获取测试结果测试
        test_scenario::end(scenario_val);
    }

    #[test]
    /// 平台-平台审核不通过上传记录
    /// 用户-同一个月重新上传记录
    fun test_upload_fix_record() {
        // 平台-创建合同
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);
        // 平台-创建合同
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_twice_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };
        // 用户-签署测试合同
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );
        };
        // 用户首次上传
        {
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_error_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 销毁 clock
            clock::destroy_for_testing(clock);
        };
        {
            // 平台-审核通过上传记录不通过
            audit_record(contract_id, &mut contracts_ref, false, string::utf8(b"fail! not the same animal!")
                , &mut system_state,  platfrom_scenario.ctx());
            // 获取合同
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(),
                get_test_x_id());
            // 测试审核次数为0
            assert!(get_audit_pass_times(contract) == 0, E_RECORD_TIMES_ERROR);
            let mut records = get_contract_records(contract);
            // 测试审核状态为不通过
            let record = vector::pop_back(&mut records);
            let record_status = get_record_status(&record);
            assert!(record_status == false, E_RECORD_RESULT_ERROR);
            // 测试合约状态为生效
            let contract_status = get_contract_status(contract);
            assert!(contract_status == 1, E_RECORD_RESULT_STATUS);
        };
        {
            // 用户-重新上传
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 销毁 clock
            clock::destroy_for_testing(clock);
        };
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
        // 结束用户测试
        test_scenario::end(user_scenario_new_ref);
        // 结束获取测试结果测试
        test_scenario::end(scenario_val);
    }

    #[test]
    /// 平台-审核通过上传记录，上传记录次数满足后平台退还
    fun test_end_contract() {
        // 平台-创建合同
        // 平台
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);

        // 平台-创建合同
        // 平台
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_once_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };

        // 用户-签署测试合同
        // 用户
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );

            // 校验合同状态为已生效
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            // 用户-上传记录
            get_contrac_id(contract)
        };
        let contract_id: ID = {
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 获取合同
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(),
                get_test_x_id());
            // 销毁 clock
            clock::destroy_for_testing(clock);
            // 用户-上传记录
            get_contrac_id(contract)
        };

        // 平台-审核通过上传记录
        audit_record(contract_id, &mut contracts_ref, true, string::utf8(b"well down!")
            , &mut system_state, platfrom_scenario.ctx());
        // 获取合同
        let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(),
            get_test_x_id());
        // 测试审核次数为1
        assert!(get_audit_pass_times(contract) == 1, E_RECORD_TIMES_ERROR);
        let mut records = get_contract_records(contract);
        // 测试审核状态为通过
        let record = vector::pop_back(&mut records);
        let record_status = get_record_status(&record);
        assert!(record_status == true, E_RECORD_RESULT_ERROR);
        // 测试合约状态为已完成
        let contract_status = get_contract_status(contract);
        assert!(contract_status == 2, E_RECORD_RESULT_STATUS);
        // todo 测试部分押金到用户，其余到平台
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
        // 结束用户测试
        test_scenario::end(user_scenario_new_ref);
        // 结束获取测试结果测试
        test_scenario::end(scenario_val);
    }

    /// 平台-测试平台判定用户弃养
    #[test]
    fun test_unusual_adopt_contract() {
        // 平台-创建合同
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_twice_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };

        // 用户-签署测试合同
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );

            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            // 用户-上传记录
            get_contrac_id(contract)
        };
        let contract_id: ID = {
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 获取合同
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(),
                get_test_x_id());
            // 销毁 clock
            clock::destroy_for_testing(clock);
            // 用户-上传记录
            get_contrac_id(contract)
        };

        {
            // 平台-判定用户状态异常
            unusual_adopt_contract(
                get_test_animal_id(),
                get_test_x_id(),
                &mut contracts_ref,
                string::utf8(b"not uplop record and no reason!"),
                &mut system_state,
                platfrom_scenario.ctx()
            );
        };
        // 获取合约信息做校验
        let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
        // 测试审核次数为0
        assert!(get_audit_pass_times(contract) == 0, E_RECORD_TIMES_ERROR);
        // 测试合约状态为异常
        let contract_status = get_contract_status(contract);
        assert!(contract_status == 4, E_RECORD_RESULT_STATUS);
        // todo 测试全部押金回退到平台
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
        // 结束用户测试
        test_scenario::end(user_scenario_new_ref);
        // 结束获取测试结果测试
        test_scenario::end(scenario_val);
    }

    /// 平台-测试平台用户弃养
    #[test]
    fun test_abendon_adopt_contract() {
        // 平台-创建合同
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_twice_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };

        // 用户-签署测试合同
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );

            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            // 用户-上传记录
            get_contrac_id(contract)
        };
        let contract_id: ID = {
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 获取合同
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(),
                get_test_x_id());
            // 销毁 clock
            clock::destroy_for_testing(clock);
            // 用户-上传记录
            get_contrac_id(contract)
        };

        {
            // 平台-判断用户弃养
            abendon_adopt_contract(get_test_animal_id(), get_test_x_id(), &mut contracts_ref, string::utf8(b"give up!"),
                &mut system_state,  platfrom_scenario.ctx());
        };
        // 获取合约信息做校验
        let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
        // 测试审核次数为0
        assert!(get_audit_pass_times(contract) == 0, E_RECORD_TIMES_ERROR);
        // 测试合约状态为弃养
        let contract_status = get_contract_status(contract);
        assert!(contract_status == 3, E_RECORD_RESULT_STATUS);
        // todo 测试押金回退到平台
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
        // 结束用户测试
        test_scenario::end(user_scenario_new_ref);
        // 结束获取测试结果测试
        test_scenario::end(scenario_val);
    }

    #[test]
    #[expected_failure(abort_code = REPEAT_UPLOAD_EXCEPTION)]
    /// 用户-测试用户同一个月上传多次信息
    fun test_upload_twice_a_month() {
        // 平台-创建合同
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);

        // 平台-创建合同
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_twice_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };

        // 用户-签署测试合同
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        let contract_id: ID = {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );

            // 校验合同状态为已生效
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            // 用户-上传记录
            get_contrac_id(contract)
        };
        {
            // 首次审批
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 销毁 clock
            clock::destroy_for_testing(clock);
        };
        // 审批首次合约
        {
            audit_record(contract_id, &mut contracts_ref, true, string::utf8(b"well down!")
                , &mut system_state,  platfrom_scenario.ctx());
        };
        {
            // 同一月二次上传会报错
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 销毁 clock
            clock::destroy_for_testing(clock);
        };
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
        // 结束用户测试
        test_scenario::end(user_scenario_new_ref);
        // 结束获取测试结果测试
        test_scenario::end(scenario_val);
    }

    #[test]
    #[expected_failure(abort_code = AUDIT_EXCEPTION)]
    /// 用户-测试用户上传第二次时，首次上传的记录未审批
    fun test_first_record_not_audit() {
        // 平台-创建合同
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);

        // 平台-创建合同
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_once_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };

        // 用户-签署测试合同
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );

            // 校验合同状态为已生效
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            // 用户-上传记录
            get_contrac_id(contract)
        };
        {
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 获取合同
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(),
                get_test_x_id());
            // 销毁 clock
            clock::destroy_for_testing(clock);
        };
        {
            // 二次上传会报错
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 销毁 clock
            clock::destroy_for_testing(clock);
        };
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
        // 结束用户测试
        test_scenario::end(user_scenario_new_ref);
        // 结束获取测试结果测试
        test_scenario::end(scenario_val);
    }

    // todo 测试非平台用户创建会报错

    #[test]
    #[expected_failure(abort_code = NOT_EXSIT_CONTRACT)]
    /// 平台-销毁合同
    fun test_destory_adopt_contact() {
        // 平台
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        // 初始化平台
        init_for_testing(platfrom_scenario.ctx());
        platfrom_scenario.next_tx(get_platform_address());
        // 合同集合
        let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
        // 创建合同
        {
            create_adopt_contract_fun(get_test_x_id(), get_test_animal_id(), &mut contracts
                , get_twice_record_times(), get_user_address(), platfrom_scenario.ctx());
            // 获取合约，此处不报错
            let contract = get_contract(&mut contracts, get_test_animal_id(), get_test_x_id());
        };
        {
            // 销毁未生效合约
            destory_adopt_contact(get_test_animal_id(), get_test_x_id(), &mut contracts, platfrom_scenario.ctx());
        };
        // 校验合约应该为空
        let contract = get_contract(&mut contracts, get_test_animal_id(), get_test_x_id());
        test_scenario::return_shared(contracts);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
    }

    #[test]
    #[expected_failure(abort_code = DESTORY_ERROR_CONTRACT)]
    /// 平台-销毁完成的合同
    fun test_destory_finish_contract() {
        // 平台-创建合同
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);
        // 平台-创建合同
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_once_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };
        // 用户-签署测试合同
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        let contract_id: ID = {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );
            // 合约信息
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            // 用户-上传记录
            get_contrac_id(contract)
        };
        {
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 销毁 clock
            clock::destroy_for_testing(clock);
        };
        {
            // 销毁合约
            destory_adopt_contact(get_test_animal_id(), get_test_x_id(), &mut contracts_ref, platfrom_scenario.ctx());
        };
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
        // 结束用户测试
        test_scenario::end(user_scenario_new_ref);
        // 结束获取测试结果测试
        test_scenario::end(scenario_val);
    }


    #[test]
    #[expected_failure(abort_code = FINISH_STATUS_ERROR)]
    /// 用户-测试合约完成后，用户二次上传
    fun test_upload_finish_contract() {
        // 平台-创建合同
        let mut scenario_val = test_scenario::begin(@0x0);
        set_up_sui_system_state(vector[@0x1, @0x2]);
        let mut system_state = test_scenario::take_shared<SuiSystemState>(&scenario_val);

        // 平台-创建合同
        let mut platfrom_scenario = test_scenario::begin(get_platform_address());
        {
            platfrom_scenario.next_tx(get_platform_address());
            // 初始化平台
            init_for_testing(test_scenario::ctx(&mut platfrom_scenario));
        };
        let (contracts): (AdoptContracts) = {
            platfrom_scenario.next_tx(get_platform_address());
            // 合同集合
            let mut contracts = platfrom_scenario.take_shared<AdoptContracts>();
            // 创建合同
            create_adopt_contract_fun(
                get_test_x_id(),
                get_test_animal_id(),
                &mut contracts,
                get_once_record_times(),
                get_user_address(),
                test_scenario::ctx(&mut platfrom_scenario)
            );
            (contracts)
        };

        // 用户-签署测试合同
        let mut user_scenario = test_scenario::begin(get_user_address());
        let (contract_id, coin, user_scenario_new) = {
            user_scenario.next_tx(get_user_address());
            // 获取刚创建的合同
            let (contract_id, coin, user_scenario_new) =
                sign_contract_step1(&contracts, user_scenario, get_user_address());
            (contract_id, coin, user_scenario_new)
        };
        let mut contracts_ref = contracts;
        let mut user_scenario_new_ref = user_scenario_new;
        let contract_id: ID = {
            sign_contract_step2(
                &mut contracts_ref,
                contract_id,
                coin,
                &mut system_state,
                user_scenario_new_ref.ctx()
            );
            // 合约信息
            let contract = get_unchange_contract(&contracts_ref, get_test_animal_id(), get_test_x_id());
            // 用户-上传记录
            get_contrac_id(contract)
        };
        {
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 销毁 clock
            clock::destroy_for_testing(clock);
        };
        // 审批
        {
            // 平台-审核通过上传记录
            audit_record(contract_id, &mut contracts_ref, true, string::utf8(b"well down!")
                , &mut system_state, platfrom_scenario.ctx());
        };
        {
            // 合约完成后二次上传会报错
            let clock = clock::create_for_testing(user_scenario_new_ref.ctx());
            upload_record(contract_id, &mut contracts_ref, get_pic(),
                &clock, user_scenario_new_ref.ctx());
            // 销毁 clock
            clock::destroy_for_testing(clock);
        };
        // share_object 还回去
        test_scenario::return_shared(contracts_ref);
        test_scenario::return_shared(system_state);
        // 结束平台测试
        test_scenario::end(platfrom_scenario);
        // 结束用户测试
        test_scenario::end(user_scenario_new_ref);
        // 结束获取测试结果测试
        test_scenario::end(scenario_val);
    }

    //==============================================================================================
    // Functions
    //==============================================================================================
    /// 创建合同
    #[test_only]
    fun create_adopt_contract_fun(x_id: string::String, animal_id: string::String, contracts: &mut AdoptContracts,
                                  record_times: u64, user_address: address, plat_form_ctx: &mut TxContext) {
        // 平台-测试创建合同
        create_adopt_contract(
            x_id,
            animal_id,
            get_test_contract_amount(),
            user_address,
            contracts,
            record_times,
            get_donate_amount(),
            plat_form_ctx
        );
    }

    /// 签署合同
    #[test_only]
    fun sign_contract_step1(
        contracts: &AdoptContracts,
        user_scenario: Scenario,
        user_address: address,
    ): (ID, Coin<SUI>, Scenario) {
        let contract = get_unchange_contract(contracts, get_test_animal_id(), get_test_x_id());
        let contract_id = get_contrac_id(contract);
        // 获取测试 coin +1SUI
        let all_amount = get_test_contract_amount() + get_donate_amount() + 1_000_000_000;
        let mut user_scenario_ref = user_scenario;
        user_scenario_ref.next_tx(user_address);
        let user_ctx = user_scenario_ref.ctx();
        let coin = coin::mint_for_testing<SUI>(all_amount, user_ctx);
        (contract_id, coin, user_scenario_ref)
    }

    #[test_only]
    fun sign_contract_step2(
        contracts: &mut AdoptContracts,
        contract_id: ID,
        coin: Coin<SUI>,
        system_state: &mut SuiSystemState,
        user_ctx: &mut TxContext,
    ) {
        // 用户-签署合约
        sign_adopt_contract(contract_id, contracts, coin, system_state, get_validator_address(),
             user_ctx);
    }

    //==============================================================================================
    // getter
    //==============================================================================================
    #[allow(unused_function)]
    fun get_user_address(): address {
        @0xa
    }

    fun get_error_user_address(): address {
        @0xc
    }

    #[allow(unused_function)]
    fun get_platform_address(): address {
        @0xb
    }

    #[allow(unused_function)]
    fun get_test_x_id(): string::String {
        string::utf8(b"xId1")
    }

    #[allow(unused_function)]
    fun get_error_test_x_id(): string::String {
        string::utf8(b"xId2")
    }

    #[allow(unused_function)]
    fun get_test_animal_id(): string::String {
        string::utf8(b"animalId1")
    }

    #[allow(unused_function)]
    /// 合约押金 1SUI
    fun get_test_contract_amount(): u64 {
        1_000_000_000
    }

    /// 需要上传2次数
    fun get_twice_record_times(): u64 {
        2
    }

    /// 需要上传1次数
    fun get_once_record_times(): u64 {
        1
    }

    #[allow(unused_function)]
    /// 平台捐献 1SUI
    fun get_donate_amount(): u64 {
        1_000_000_000
    }

    /// 获取正常的图片
    fun get_error_pic(): string::String {
        string::utf8(b"ccc")
    }

    /// 获取正常的图片
    fun get_pic(): string::String {
        string::utf8(b"aaa")
    }

    /// 获取异常的图片
    #[allow(unused_function)]
    fun get_unusual_pic(): string::String {
        string::utf8(b"bbb")
    }

    #[allow(unused_function)]
    fun get_validator_address(): address {
        @0x2
    }
}

