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
        module: "filling",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.stateID)
        ]
    });
    return tx;
}