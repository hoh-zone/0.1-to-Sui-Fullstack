
import { Transaction } from "@mysten/sui/transactions";
import { networkConfig, suiClient } from "../networkConfig";

export const queryState = async () => {
    const state = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::contract::ProfileCreated`
        }
    })
    return state;
}

// public struct Profile has key{
//     id: UID,
//     name: String,
//     description: String,
// }

export const createProfileTx = async (name: string, description: string) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "contract",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.state)
        ]
    });
    return tx;
};
