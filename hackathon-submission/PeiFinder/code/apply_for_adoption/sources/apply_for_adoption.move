/// Module: apply_for_adoption
module apply_for_adoption::apply_for_adoption {
    //==============================================================================================
    // Dependencies
    //==============================================================================================
    use std::debug;
    use sui::object::{ Self, ID};
    use std::string::{Self, String};
    use std::vector::{Self, length, empty, push_back, is_empty};
    use sui::event;
    use std::option::{ some, none, is_some, extract, borrow};
    use sui::balance::{Balance, value, split};
    use sui::coin::{Coin, Self};
    use sui::sui::SUI;
    use sui::clock::{Clock, Self};
    use sui::table::{Self, Table};
    use sui_system::sui_system::{ SuiSystemState, request_withdraw_stake_non_entry, request_add_stake_non_entry};
    use sui_system::staking_pool::{StakedSui};
    use sui::dynamic_field::{Self};
    use sui::transfer;
    use std::debug::print;
    use sui::balance;
    use sui::dynamic_object_field;


    //==============================================================================================
    // Constants
    //==============================================================================================
    /// 0-未生效
    const NOT_YET_IN_FORCE: u8 = 0;
    /// 1-生效
    const IN_FORCE: u8 = 1;
    /// 2-完成（完成回访）
    const FINISH: u8 = 2;
    /// 3-放弃
    const GIVE_UP: u8 = 3;
    /// 4-异常
    const UNSUAL: u8 = 4;

    //==============================================================================================
    // Error codes
    //==============================================================================================
    /// 已被领养
    const ADOPTED_EXCEPTION: u64 = 100;
    /// 领养异常
    const UNSUAL_ERROR: u64 = 101;
    /// 操作地址错误
    const ERROR_ADDRESS: u64 = 102;
    /// 找不到合约
    const NOT_EXSIT_CONTRACT: u64 = 103;
    /// 重复上传
    const REPEAT_UPLOAD_EXCEPTION: u64 = 104;
    /// 审核异常
    const AUDIT_EXCEPTION: u64 = 105;
    /// 押金异常
    const CONTRACT_AMOUNT_EXCEPTION: u64 = 106;
    /// 回访次数异常
    const CONTRRACT_RECORD_TIMES_EXCEPTION: u64 = 107;
    /// 缺少质押合同
    const LACK_LOCK_STAKE_ERROR: u64 = 108;
    /// 合同已完成，不需要再上传
    const FINISH_STATUS_ERROR: u64 = 109;
    /// 余额不足
    const E_SUFFICIENT_BALANCE: u64 = 110;
    /// 价格大于1SUI
    const E_MIN_STAKING_THRESHOLD: u64 = 111;
    /// 审批结果为空
    const EMPTY_RESULT_ERROR: u64 = 112;
    /// 销毁的合约不符合规范
    const DESTORY_ERROR_CONTRACT: u64 = 113;
    /// 合约押金金额异常
    const AMOUNT_ERROR: u64 = 114;


    //==============================================================================================
    // Structs
    //==============================================================================================

    /// 领养合约 平台生成，owner 是平台
    public struct AdoptContract has store, drop {
        id: ID,
        // 领养用户xid
        xId: String,
        // 领养动物id
        animalId: String,
        // 领养花费币 <T>
        amount: u64,
        // 回访记录
        records: vector<Record>,
        // 领养人链上地址（用于交退押金）,指定领养人，避免被其他人领养
        adopterAddress: address,
        // 平台地址
        platFormAddress: address,
        // 合约状态：0-未生效；1-生效；2-完成（完成回访）；3-放弃；4-异常
        status: u8,
        // 备注
        remark: String,
        // 规定传记录次数
        recordTimes: u64,
        // 质押合同
        locked_stake_id: Option<ID>,
        // 审核通过次数
        auditPassTimes: u64,
        // 捐赠给平台的币
        donateAmount: u64,
    }

    // 回访记录
    public struct Record has store, drop, copy {
        // 宠物图片
        pic: String,
        // 记录日期
        date: u64,
        // 年月记录上传图片的日期
        yearMonth: u64,
        // 审核结果：true-通过；false-不通过
        auditResult: Option<bool>,
        // 审核备注
        auditRemark: String,
    }

    // 动物信息
    // public struct Animal has key, store {
    //     id: UID,
    //     // 姓名
    //     name: String,
    //     // 品种
    //     species: String,
    //     // 图片
    //     pic: String,
    // }

    /// 所有的领养合约，包含未生效、生效、完成、弃养的合约
    /// 一个动物id可能会有多个合约的情况，也需要允许这种情况存在
    public struct AdoptContracts has key {
        id: UID,
        // key:animalId value:vector<ID> 动物id，合约
        animal_contracts: Table<String, vector<ID>>,
        // key:xId value:vector<ID> x用户id，合约
        user_contracts: Table<String, vector<ID>>,
        contracts: Table<ID, AdoptContract>,
        // key:id value:LocakedStakeInfo
        locked_stakes: Table<ID, LockedStake>
    }

    /// 质押合同
    public struct LockedStake has store {
        id: ID,
        // 质押合同
        staked_sui: StakedSui,
        // 平台地址
        platformAddress: address,
    }

    /// 公共uid
    public struct PublicUid has key {
        id: UID,
    }


    //==============================================================================================
    // Init
    //==============================================================================================
    fun init(ctx: &mut TxContext) {
        // 公共浏览所有的合约
        transfer::share_object(AdoptContracts {
            id: object::new(ctx),
            animal_contracts: table::new<String, vector<ID>>(ctx),
            user_contracts: table::new<String, vector<ID>>(ctx),
            contracts: table::new<ID, AdoptContract>(ctx),
            locked_stakes: table::new<ID, LockedStake>(ctx)
        });
        // todo 添加平台地址，避免其他人生成合同
    }


    //==============================================================================================
    // Event Structs
    //==============================================================================================
    /// 创建合约后通知
    public struct CreateAdoptContractEvent has copy, drop {
        xId: String,
        animalId: String,
        contractId: ID,
        status: u8,
    }

    //==============================================================================================
    // Entry Functions
    //==============================================================================================

    // 创建合约
    public entry fun create_adopt_contract(
        // 领养人的x账号，用于校验用户信息
        x_id: String,
        // 领养动物id
        animal_id: String,
        // 领养合约金额
        amount: u64,
        // 领养人链上地址(用于校验用户以及退还押金)
        adopter_address: address,
        // 合约记录
        contracts: &mut AdoptContracts,
        // 合约需要记录的次数
        record_times: u64,
        // 捐赠给平台的币
        donateAmount: u64,
        // 获取 transcation 需要的信息
        ctx: &mut TxContext,
    ) {
        // todo 怎么确认当前创建合约的人是平台不是其他人
        // 平台
        let owner = sui::tx_context::sender(ctx);
        // 校验合约押金应该>0
        assert!(amount > 0, CONTRACT_AMOUNT_EXCEPTION);
        // 校验回访次数应该 >0
        assert!(record_times > 0, CONTRRACT_RECORD_TIMES_EXCEPTION);
        // 校验动物没有被领养
        assert!(check_animal_is_adopted(contracts, animal_id) == false, ADOPTED_EXCEPTION);
        // 校验用户没有领养状态异常
        assert!(check_user_is_unusual(contracts, x_id) == false, UNSUAL_ERROR);
        // 创建新的合同
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        // 空回访记录
        let records = empty<Record>();
        // 合约状态：未生效
        let status = NOT_YET_IN_FORCE;
        let remark = b"".to_string();
        // 质押押金必须大于 1_000_000_000 (1SUI)
        assert!(amount >= 1_000_000_000, E_MIN_STAKING_THRESHOLD);
        // 创建一个新的领养合约
        let new_contract =
            AdoptContract {
                id: id, // TODO id应该是object::new(ctx)这样创建的
                // 领养用户xid
                xId: x_id,
                // 领养动物id
                animalId: animal_id,
                // 领养花费币 <SUI>
                amount,
                // 回访记录
                records,
                // 领养人链上地址（用于交退押金）,指定领养人，避免被其他人领养
                adopterAddress: adopter_address,
                // 平台地址
                platFormAddress: owner,
                // 合约状态：0-未生效；1-生效；2-完成（完成回访）；3-放弃；4-异常
                status,
                // 备注
                remark,
                // 合约需要记录的次数
                recordTimes: record_times,
                // 质押合同
                locked_stake_id: none(),
                // 审核通过次数
                auditPassTimes: 0,
                // 捐赠给平台的币
                donateAmount,
            };
        // 放到合约记录中
        add_contract(contracts, new_contract, animal_id, x_id);
        // todo 通知前端生成
        event::emit(CreateAdoptContractEvent {
            xId: x_id,
            animalId: animal_id,
            contractId: id,
            status,
        });
        // 丢弃uid
        object::delete(uid);
    }

    /// 用户-签署合同并缴纳押金
    /// 添加合同时明确捐赠部分费用
    public entry fun sign_adopt_contract(contract_id: ID,
                                         adopt_contains: &mut AdoptContracts,
                                         coin: Coin<SUI>,
                                         system_state: &mut SuiSystemState,
                                         validator_address: address,
                                         ctx: &mut TxContext) {
        // 校验合同是否存在
        let contract = table::borrow_mut(&mut adopt_contains.contracts, contract_id);
        // 校验合同是否是该用户可以签署的
        assert!(contract.adopterAddress == sui::tx_context::sender(ctx), ERROR_ADDRESS);
        // 校验合约应未被签署
        assert!(contract.status == NOT_YET_IN_FORCE, ADOPTED_EXCEPTION);
        // 质押合同所需要的金额(合约押金+捐赠给平台)
        let contract_amount = contract.donateAmount + contract.amount;
        let mut mut_coin = coin;
        // 拆分出质押合同所需要的金额
        let (contract_balance, balance): (Balance<SUI>, u64) = {
            // coin 中获取余额
            let coin_balance = coin::balance_mut(&mut mut_coin);
            // 校验用户余额是否足够（押金+捐赠金）
            assert!(value(coin_balance) >= contract_amount, E_SUFFICIENT_BALANCE);
            let mut contract_balance = split(coin_balance, contract_amount);
            let balance = coin_balance.value();
            (contract_balance, balance)
        };
        let mut mut_contract_balance = contract_balance;
        // 拆除剩余的金额返回给用户
        if (balance > 0) {
            let info = b"balance: ".to_string();
            debug::print(&info);
            debug::print(&balance);
            transfer::public_transfer(mut_coin, sui::tx_context::sender(ctx));
        } else {
            coin::destroy_zero(mut_coin);
        };
        // 捐赠 balance
        if (contract.donateAmount > 0) {
            let plat_form_balance = split(&mut mut_contract_balance, contract.donateAmount);
            // 存储进平台
            let coin = coin::from_balance(plat_form_balance, ctx);
            transfer::public_transfer(coin, contract.platFormAddress);
        };
        debug::print(&mut_contract_balance);
        // 校验合约押金与当前余额相同
        assert!(balance::value(&mut_contract_balance) == contract.amount, AMOUNT_ERROR);
        // 将剩余的balance(押金) 添加到 Sui 系统中,完成质押 stake()
        let staked_sui = request_add_stake_non_entry(
            system_state,
            coin::from_balance(mut_contract_balance, ctx),
            validator_address,
            ctx,
        );
        // 创建质押合同
        let uid = object::new(ctx);
        let id = object::uid_to_inner(&uid);
        // let stake_sui_option = some(staked_sui);
        let mut locked_stake = LockedStake {
            id,
            staked_sui,
            platformAddress: sui::tx_context::sender(ctx),
        };
        object::delete(uid);
        // 质押合同存储到领养合约中
        let locked_stake_id = locked_stake.id;
        // 动态字段增加质押合约
        // dynamic_field::add<ID, LockedStake>(&mut public_uid.id, locked_stake_id, locked_stake);
        // 保存质押合同
        table::add(&mut adopt_contains.locked_stakes, locked_stake_id, locked_stake);
        debug::print(&locked_stake_id);
        // 领养合同增加质押合同id
        contract.locked_stake_id = some(locked_stake_id);
        // 更新合同状态
        contract.status = IN_FORCE;
        // todo 通知前端
    }

    /// 平台-销毁未生效合约，非未生效合约会报错并中止
    public entry fun destory_adopt_contact(
        animal_id: String,
        x_id: String,
        contracts: &mut AdoptContracts,
        ctx: &mut TxContext,
    ) {
        // 找到对应的合同
        let contract: &mut AdoptContract = {
            get_adopt_contract(&mut contracts.animal_contracts, &contracts.user_contracts, &mut contracts.contracts,
                animal_id, x_id)
        };
        // 生效中/已完成的合约不能删除
        assert!(contract.status != IN_FORCE && contract.status != FINISH, DESTORY_ERROR_CONTRACT);
        let contract_id = contract.id;
        let owner = sui::tx_context::sender(ctx);
        // 获取合约平台地址
        let plat_form_address = contract.platFormAddress;
        // 校验是否是平台创建的
        assert!(plat_form_address == owner, ERROR_ADDRESS);
        // 移除用户合约
        let user_contract_ids = table::borrow_mut(&mut contracts.user_contracts, x_id);
        let (user_contains, user_index) = vector::index_of(user_contract_ids, &contract_id);
        assert!(user_contains == true, NOT_EXSIT_CONTRACT);
        let remove_contract_id = vector::swap_remove(user_contract_ids, user_index);
        // 移除动物合约
        let animal_contract_ids = table::borrow_mut(&mut contracts.animal_contracts, animal_id);
        let (animal_contains, animal_index) = vector::index_of(animal_contract_ids, &contract_id);
        assert!(animal_contains == true, NOT_EXSIT_CONTRACT);
        let _ = vector::swap_remove(animal_contract_ids, animal_index);
        //  删除合约
        let _ = table::remove(&mut contracts.contracts, remove_contract_id);
        // todo 通知前端移除完成
    }

    ///平台-更新合约状态：放弃领养,并添加备注
    public entry fun abendon_adopt_contract(
        animal_id: String,
        x_id: String,
        contracts: &mut AdoptContracts,
        remark: String,
        system_state: &mut SuiSystemState,
        ctx: &mut TxContext,
    ) {
        // 获取合约
        let contract: &mut AdoptContract = get_adopt_contract(
            &mut contracts.animal_contracts,
            &contracts.user_contracts,
            &mut contracts.contracts,
            animal_id,
            x_id
        );
        // 更新状态
        let owner = sui::tx_context::sender(ctx);
        // 校验是否是创建者创建
        assert!(contract.platFormAddress == owner, ERROR_ADDRESS);
        // 更新状态
        contract.status = GIVE_UP;
        contract.remark = remark;
        // 退养后押金处理
        // 用户退养后，平台可解锁质押合同，按比例退还押金与利息
        unstake(system_state, contract, false, &mut contracts.locked_stakes, ctx);
    }

    /// 平台-更新合约状态：异常，并添加备注
    /// 用户长时间不上传，平台可设置为异常状态
    public entry fun unusual_adopt_contract(
        animal_id: String,
        x_id: String,
        contracts: &mut AdoptContracts,
        remark: String,
        system_state: &mut SuiSystemState,
        ctx: &mut TxContext,
    ) {
        // 获取合约
        let contract: &mut AdoptContract = get_adopt_contract(
            &mut contracts.animal_contracts,
            &contracts.user_contracts,
            &mut contracts.contracts,
            animal_id,
            x_id
        );
        // let locked_stake_id = option::borrow(&contract.locked_stake_id);
        // 更新合同状态
        // 获取用户合约
        let owner = sui::tx_context::sender(ctx);
        // 校验是否是创建者创建
        assert!(contract.platFormAddress == owner, ERROR_ADDRESS);
        // 更新状态
        contract.status = UNSUAL;
        contract.remark = remark;
        // 异常状态押金处理：全数退还给平台
        unstake(system_state, contract, false, &mut contracts.locked_stakes, ctx);
    }


    /// 用户-上传回访记录
    public entry fun upload_record(
        contract_id: ID,
        contracts: &mut AdoptContracts,
        pic: String,
        clock: &Clock,
        ctx: &mut TxContext,
    ) {
        // 获取合约,不存在会抛异常
        let contract = table::borrow_mut(&mut contracts.contracts, contract_id);
        // 校验合同是否是该用户可以签署的
        assert!(contract.adopterAddress == sui::tx_context::sender(ctx), ERROR_ADDRESS);
        // 校验合同是否已经完成回访
        assert!(contract.status != FINISH, FINISH_STATUS_ERROR);
        // todo 检查能否获取当前年月
        let year_month = clock::timestamp_ms(clock) / 1000 / 60 / 60 / 24 / 30;
        // 获取合约上传记录
        let record_length = length(&contract.records);
        // 首次上传不需要做校验
        if (record_length > 0) {
            // 获取最后一次上传记录
            let last_record = vector::borrow(&contract.records, (record_length - 1));
            // 最后一次上传记录的结果
            let last_audit_result_option = last_record.auditResult;
            // 校验最后一次记录平台需要审核，最后一次记录没有审核，无法上传新的记录
            assert!(is_some(&last_audit_result_option) == true, AUDIT_EXCEPTION);
            // 获取最后一次上传记录的年月
            let last_audit_result = option::borrow<bool>(&last_audit_result_option);
            // 获取最后一次上传记录审批结果
            if (is_some(&last_audit_result_option) && last_audit_result == true) {
                // 校验是否有重复上传
                assert!(year_month != last_record.yearMonth, REPEAT_UPLOAD_EXCEPTION);
            };
        };
        let record = Record {
            pic,
            date: clock::timestamp_ms(clock),
            yearMonth: year_month,
            auditResult: none(),
            auditRemark: b"".to_string(),
        };
        // 上传回访记录
        push_back(&mut contract.records, record);
        // todo 通知前端有用户上传回访记录
    }

    // 平台-审核上传的回访记录
    public entry fun audit_record(contract_id: ID,
                                  contracts: &mut AdoptContracts,
                                  // 审核结果：true-通过；false-不通过
                                  audit_result: bool,
                                  // 审核备注
                                  audit_remark: String,
                                  system_state: &mut SuiSystemState,
                                  ctx: &mut TxContext) {
        // 合约信息,不存在会直接抛异常
        let contract = table::borrow_mut(&mut contracts.contracts, contract_id);
        // 校验合约必须生效
        assert!(contract.status == IN_FORCE, NOT_EXSIT_CONTRACT);
        // 校验当前用户是否是平台
        assert!(contract.platFormAddress == sui::tx_context::sender(ctx), ERROR_ADDRESS);
        // 获取审核通过次数
        let mut audit_pass_times = contract.auditPassTimes;
        // 审核通过增加审核通过次数
        if (audit_result) {
            contract.auditPassTimes = audit_pass_times + 1;
            audit_pass_times = audit_pass_times + 1;
        };
        // 获取记录次数
        let record_length = vector::length(&contract.records);
        // 获取最后一次上传记录
        let last_record = vector::borrow_mut(&mut contract.records, record_length - 1);
        // 更新回访记录备注
        contract.remark = audit_remark;
        // 更新审核结果
        last_record.auditResult = option::some<bool>(audit_result);
        // 获取需要记录次数
        let record_times = contract.recordTimes;
        // 校验合同审核通过次数是否等于需要记录次数
        if (audit_pass_times == record_times) {
            // 更新合同状态
            contract.status = FINISH;
            // 退还押金与利息
            unstake(system_state, contract, true, &mut contracts.locked_stakes, ctx);
        };
        // todo 通知用户审核结果
    }

    //==============================================================================================
    // Getter/Setter Functions
    //==============================================================================================

    /// 获取缺失质押合同异常状态
    public fun get_lack_lock_stake_exception_status(): u64 {
        LACK_LOCK_STAKE_ERROR
    }

    /// 获取异常状态值
    public fun get_in_force_status(): u8 {
        IN_FORCE
    }

    /// 在用户领养的合约中找到合同
    public(package) fun get_adopt_contract(
        // contracts: &mut AdoptContracts,
        animal_contracts: &mut Table<String, vector<ID>>,
        user_contracts: &Table<String, vector<ID>>,
        contracts: &mut Table<ID, AdoptContract>,
        animal_id: String,
        x_id: String
    ): &mut AdoptContract {
        // 校验合同是否存在
        assert!(table::contains(animal_contracts, animal_id) == true, NOT_EXSIT_CONTRACT);
        assert!(table::contains(user_contracts, x_id) == true, NOT_EXSIT_CONTRACT);
        // 从动物id中找到合约
        let animal_contract_ids = table::borrow_mut(animal_contracts, animal_id);
        let mut index = 0;
        let contracts_length = length(animal_contract_ids);
        // 合约length >0
        assert!(contracts_length > 0, NOT_EXSIT_CONTRACT);
        // 是否存在合约
        let mut sign = false;
        let mut contract_id = vector::borrow_mut(animal_contract_ids, index);
        while (contracts_length > index) {
            contract_id = vector::borrow_mut(animal_contract_ids, index);
            let copy_contract_id = *contract_id;
            let contract = table::borrow(contracts, copy_contract_id);
            let contract_x_id = contract.xId;
            if (x_id == contract_x_id) {
                sign = true;
                break
            } else {
                index = index + 1;
                continue
            }
        };
        assert!(sign == true, NOT_EXSIT_CONTRACT);
        return table::borrow_mut(contracts, *contract_id)
    }

    /// 在用户领养的合约中找到不可变合同
    public(package) fun get_unchange_adopt_contract(
        contracts: &AdoptContracts,
        animal_id: String,
        x_id: String
    ): &AdoptContract {
        // 校验合同是否存在
        assert!(table::contains(&contracts.animal_contracts, animal_id) == true, NOT_EXSIT_CONTRACT);
        assert!(table::contains(&contracts.user_contracts, x_id) == true, NOT_EXSIT_CONTRACT);
        // 从动物id中找到合约
        let animal_contract_ids = table::borrow(&contracts.animal_contracts, animal_id);
        let mut index = 0;
        let contracts_length = length(animal_contract_ids);
        // 是否存在合约
        let mut sign = false;
        let mut contract_id = vector::borrow(animal_contract_ids, index);
        while (contracts_length > index) {
            contract_id = vector::borrow(animal_contract_ids, index);
            let copy_contract_id = *contract_id;
            let contract = table::borrow(&contracts.contracts, copy_contract_id);
            let contract_x_id = contract.xId;
            if (x_id == contract_x_id) {
                sign = true;
                break
            } else {
                index = index + 1;
                continue
            }
        };
        assert!(sign == true, NOT_EXSIT_CONTRACT);
        return table::borrow(&contracts.contracts, *contract_id)
    }

    public(package) fun get_contrac_id(contract: &AdoptContract): ID {
        contract.id
    }

    public(package) fun get_contract_records(contract: &AdoptContract): vector<Record> {
        contract.records
    }

    public(package) fun get_contract_status(contract: &AdoptContract): u8 {
        contract.status
    }

    public(package) fun get_x_id(contract: &AdoptContract): String {
        contract.xId
    }

    public(package) fun get_audit_pass_times(contract: &AdoptContract): u64 {
        contract.auditPassTimes
    }

    public(package) fun get_record_status(record: &Record): &bool {
        borrow(&record.auditResult)
    }
    //==============================================================================================
    // Functions
    //==============================================================================================

    /// 平台-解锁质押合同，返回该返回的币
    public fun unstake(
        system_state: &mut SuiSystemState,
        contract: &mut AdoptContract,
        // 是否全部退还
        is_all: bool,
        locked_stake_table: &mut Table<ID, LockedStake>,
        ctx: &mut TxContext,
    ) {
        // 动态字段获取质押合同
        let locked_stake_id = borrow(&contract.locked_stake_id);
        // 获取质押合同
        let mut locked_stake = table::remove(locked_stake_table, *locked_stake_id);
        // dynamic_field::borrow_mut<ID, LockedStake>(&mut public_uid.id, *locked_stake_id);
        // Sui 系统模块提供的函数，用于解质押并结算奖励。会将质押对象（StakedSui）转换为 SUI 余额，包括本金和累积的奖励
        let LockedStake { id: _, staked_sui, platformAddress: _ } = locked_stake;
        // let staked_sui_entry = extract(&mut staked_sui);
        let mut withdraw_balance = request_withdraw_stake_non_entry(system_state, staked_sui, ctx);
        // 押金与利息
        let withdraw_amount = value(&withdraw_balance);
        // 退还的利息 >= 合约押金
        assert!(withdraw_amount >= contract.amount, AMOUNT_ERROR);
        debug::print(&withdraw_amount);
        // 根据是否全部退还的条件，进行退还押金
        if (is_all) {
            // 退还押金与利息给用户
            store_to_target(withdraw_balance, contract.adopterAddress, ctx)
        } else {
            // 退养状态
            if (contract.status == UNSUAL) {
                // 退还比例：（质押期间的利息+本金） / （合约需要记录的次数+1）* 审核通过次数
                let recordTimes = contract.recordTimes;
                let auditPassTimes = contract.auditPassTimes;
                let adopterAmount = withdraw_amount / recordTimes * auditPassTimes;
                // 平台获取剩余的部分
                let plat_form_amount = withdraw_amount - adopterAmount;
                let plaf_form_balance = split(&mut withdraw_balance, plat_form_amount);
                store_to_target(plaf_form_balance, contract.platFormAddress, ctx);
                // 退还押金与利息给用户
                store_to_target(withdraw_balance, contract.adopterAddress, ctx);
            } else {
                // 异常状态或其他状态全数退还给平台
                store_to_target(withdraw_balance, contract.platFormAddress, ctx);
            }
        }
        // 前端通知用户
    }

    /// 存储到对应地址
    public fun store_to_target(balance: Balance<SUI>, targetAddress: address, ctx: &mut TxContext) {
        // balance 2 coin for transfer
        let coin = coin::from_balance(balance, ctx);
        transfer::public_transfer(coin, targetAddress);
    }

    /// 添加合约
    public(package) fun add_contract(contracts: &mut AdoptContracts, contract: AdoptContract
                                     , animal_id: String, x_id: String) {
        // 添加用户合约
        add_contract_id(&mut contracts.user_contracts, x_id, contract.id);
        // 添加动物合约
        add_contract_id(&mut contracts.animal_contracts, animal_id, contract.id);
        // 合同信息加入到合同列表中
        table::add(&mut contracts.contracts, contract.id, contract);
    }

    /// 添加合约id到对应的table中
    fun add_contract_id(table: &mut Table<String, vector<ID>>, key: String, id: ID) {
        let is_contract_contains = table::contains(table, key);
        if (is_contract_contains) {
            // 存在则直接添加
            let contract_ids = table::borrow_mut(table, key);
            vector::push_back(contract_ids, id);
        } else {
            let mut contract_ids = vector::empty<ID>();
            vector::push_back(&mut contract_ids, id);
            table::add(table, key, contract_ids);
        };
    }


    /// 查询动物是否有被领养
    public(package) fun check_animal_is_adopted(contracts: &AdoptContracts, animal_id: String): bool {
        let is_animal_contains_contract = table::contains(&contracts.animal_contracts, animal_id);
        if (is_animal_contains_contract) {
            // 注意：不存在会报错
            let contract_ids = table::borrow(&contracts.animal_contracts, animal_id);
            let contract_lenght = length(contract_ids);
            let mut index = 0;
            let mut is_adopted = false;
            while (contract_lenght > index) {
                let contract_id = vector::borrow(contract_ids, index);
                let contract_id_entry = *contract_id;
                let contract = table::borrow(&contracts.contracts, contract_id_entry);
                // 校验动物不存在未生效、生效中、已完成的合同
                if (contract.status != NOT_YET_IN_FORCE && contract.status != IN_FORCE && contract.status != FINISH) {
                    index = index + 1;
                } else {
                    is_adopted = true;
                    break
                }
            };
            is_adopted
        } else {
            is_animal_contains_contract
        }
    }

    /// 查询该用户是否有异常领养记录
    public(package) fun check_user_is_unusual(contracts: &AdoptContracts, x_id: String): bool {
        if (table::contains(&contracts.user_contracts, x_id)) {
            let contract_ids = table::borrow(&contracts.user_contracts, x_id);
            let contract_length = length(contract_ids);
            let mut index = 0;
            let mut is_unusual = false;
            while (contract_length > index) {
                let contract_id = vector::borrow(contract_ids, index);
                let contract_id_entry = *contract_id;
                let contract = table::borrow(&contracts.contracts, contract_id_entry);
                index = index + 1;
                // 校验动物不存在异常状态
                if (contract.status != UNSUAL) {
                    index = index + 1;
                } else {
                    is_unusual = true
                };
            };
            is_unusual
        } else {
            false
        }
    }

    //==============================================================================================
    // Helper Functions
    //==============================================================================================
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }


    #[test_only]
    public fun get_contract(contracts: &mut AdoptContracts, animal_id: String, x_id: String): &mut AdoptContract {
        get_adopt_contract(&mut contracts.animal_contracts, &contracts.user_contracts, &mut contracts.contracts,
            animal_id, x_id)
    }

    #[test_only]
    public fun get_unchange_contract(contracts: &AdoptContracts, animal_id: String, x_id: String): &AdoptContract {
        get_unchange_adopt_contract(contracts, animal_id, x_id)
    }
}


