import { networkConfig, suiClient, suiGraphQLClient} from "@/networkConfig";
import {Transaction} from "@mysten/sui/transactions";
import {SUI_TYPE_ARG} from "@mysten/sui/utils";


/*
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
    )*/

export const createAdoptContract = async (xId: string,
                                          animal_id: string,
                                          amount: number,
                                          // 领养人链上地址(用于校验用户以及退还押金)
                                          adopterAddress: string,
                                          // 合约需要记录的次数
                                          recordTimes: number,
                                          // 捐赠给平台的币
                                          donateAmount: number) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "apply_for_adoption",
        function: "create_adopt_contract",
        arguments: [
            tx.pure.string(xId),
            tx.pure.string(animal_id),
            tx.pure.u64(amount),
            tx.pure.address(adopterAddress),
            tx.object(networkConfig.testnet.adoptContracts),
            tx.pure.u64(recordTimes),
            tx.pure.u64(donateAmount)
        ]
    })
    return tx;
}

// 为了简单测试，先获取首个sui的coin
export const getFirstSuiCoinObjectId = async (address:string) => {
    const coins = suiClient.getCoins({
        owner: address,
        coinType: SUI_TYPE_ARG
    });
    coins.then((res) => {
        debugger
        console.log(1)
        if (res.data.length > 0) {
            return res.data[0].coinObjectId;
        } else {
            console.log("缺少合约")
            return '';
        }
    })
};


