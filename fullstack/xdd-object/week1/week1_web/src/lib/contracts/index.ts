import { networkConfig, suiClient } from "@/networkConfig";
import { Transaction } from "@mysten/sui/transactions";

export const queryState = async () => {
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageId}::week1::ProfileCreatedEvent`,
        },
    }); 
    console.log(events);
    return events;
}

export const queryObject = async (id: string) => {
    const state = await suiClient.getObject({
        id: id,
        options: {
            showContent: true,
        },
    });
    return state;
}

/*
public entry fun create_profile(state: &mut State, name: String, desc: String, ctx: &mut TxContext)
 */

export const createProfile = async (name: string, desc: string) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageId,
        module: "week1",
        function: "create_profile",
        arguments: [tx.object(networkConfig.testnet.stateId), tx.pure.string(name), tx.pure.string(desc)],
    });
    return tx;
}

/* 
public fun get_profile(state: &State, ctx: &mut TxContext) :Option<address>
*/

export const getProfile = async () => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageId,
        module: "week1",
        function: "get_profile",
        arguments: [tx.object(networkConfig.testnet.stateId)],
    });
    return tx;
}


