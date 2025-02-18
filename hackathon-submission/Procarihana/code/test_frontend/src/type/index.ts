import {CoinMetadata} from "@mysten/sui/client"


/*
    public struct AdoptContracts has key {
        id: UID,
        animal_contracts: Table<String, vector<ID>>,
        user_contracts:,
        contracts: Table<ID, AdoptContract>,
    }
56*/

export type AdoptContracts = {
    id: { id: string },
    animalContracts: AnimalContracts[],
    userContracts: UserContracts[],
    contracts: Contracts[],
}
/*
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
*/
export type AdoptContract = {
    id: string,
    // 领养用户xid
    xId: string,
    // 领养动物id
    animalId: string,
    // 领养花费币 <T>
    amount: number,
    // 回访记录
    records: Record[],
    // 领养人链上地址（用于交退押金）,指定领养人，避免被其他人领养
    // 平台地址
    platFormAddress: string,
    // 合约状态：0-未生效；1-生效；2-完成（完成回访）；3-放弃；4-异常
    status: number,
    // 备注
    remark: string,
    // 规定传记录次数
    recordTimes: number,
    // 质押合同
    locked_stake_id: string,
    // 审核通过次数
    auditPassTimes: number,
    // 捐赠给平台的币
    donateAmount: number,
}
/*
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
 */
export type Record = {
    // 宠物图片
    pic: string,
    // 记录日期
    date: number,
    // 年月记录上传图片的日期
    yearMonth: number,
    // 审核结果：true-通过；false-不通过
    auditResult: boolean,
    // 审核备注
    auditRemark: number,
}

export type AnimalContracts = {
    animalId: string,
    contractId: string[]
}
export type UserContracts = {
    xId: string,
    contractId: string[]
}
export type Contracts = {
    contractId: string,
    adoptContract: AdoptContract
}
export type SuiObject = {
    id: string,
    type: string,
    coinMetadata?: CoinMetadata,
    balance?: number,
}

export type FolderData = {
    name: string,
    value: string,
}

export type Folder = {
    id: { id: string },
    name: string,
    description: string,
}

export type State = {
    users: User[]
}

export type User = {
    owner: string,
    profile: string,
}

export type EventProfileCreated = {
    profile: string,
    owner: string,
}

export type EventFolderCreated = {
    id: string,
    owner: string,
}

export type EventCoinWrapped = {
    folder: string,
    coin_type: string,
    amount: number,
    new_balance: number,
}
