import {networkConfig, suiClient} from "@/networkConfig.ts";
import {Transaction} from "@mysten/sui/transactions"

// export const queryState = async (statedID: string) => {
export const queryState = async () => {
    /*
module c33dd8ff25cfc78a10f8660a3e9362becf1501cf7c5deb8fd285ed5d28ef4027.filling {
use 0000000000000000000000000000000000000000000000000000000000000001::option;
use 0000000000000000000000000000000000000000000000000000000000000001::string;
use 0000000000000000000000000000000000000000000000000000000000000002::event;
use 0000000000000000000000000000000000000000000000000000000000000002::object;
use 0000000000000000000000000000000000000000000000000000000000000002::table;
use 0000000000000000000000000000000000000000000000000000000000000002::transfer;
use 0000000000000000000000000000000000000000000000000000000000000002::tx_context;
*/
    // 通过直接获取 object ，无法直接获取里面的值，需要根据id 多次查询
    // const state = await suiClient.getObject({
    //     // id: statedID,
    //     id: networkConfig.testnet.packageID,
    //     options: {
    //         // 获取更多的信息，打印出本次 transaction 中 share_object id 等信息
    //         showContent: true,
    //     }
    // });
    // const stateData = state.data?.content
    // console.log("stateData", stateData)
    // 通过 event 获取数据更方便
    const stateData = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::filling::ProfileCreated`
        }
    })
    console.log("stateData", stateData)
    return stateData;
}

/*   public entry fun create_profile(
        name: String,
        description: String,
        state: &mut State, --> id
        // 辅助性的module，获取 transcation 需要的信息
        ctx: &mut TxContext,
    )
    */
export const createProfile = async (name: string, description: string, statedID: string) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "filling",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.pure.string(statedID),
        ]

    })
    return tx;
}

export const createProfileTx = async (name: string, description: string) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "filling",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.state)
        ]
    })
    return tx;
}