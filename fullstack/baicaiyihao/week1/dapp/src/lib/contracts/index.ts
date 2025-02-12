import { suiClient, networkConfig } from "../../networkConfig";
import { Transaction } from "@mysten/sui/transactions";

export const queryState = async ()=>{
    // const state = await suiClient.getObject({
    //     id: networkConfig.testnet.stateID,
    //     options: {
    //         showContent: true,
    //     }
    // });
    const state = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::filling::ProfileCreated`
        }
    });
    return state;
}

export const createProfileTx = async (name: string, description: string)=>{
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "vault",
        function: "withdraw_coin_from_manager",
        arguments: [
            tx.object("0xf570aae3af4704e41b031cee81b3e5d4882cadf74a253af05c49be2b9be6c2aa"),
            tx.pure.id("0xee2af550d9a51b19e602ffde66a598bb314a127520e6cacb261a1f1e4e77cbb9"),
            tx.pure.u64("0")
        ]
    });
    return tx;
}