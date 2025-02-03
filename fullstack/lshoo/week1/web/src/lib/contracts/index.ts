
import { Transaction } from "@mysten/sui/transactions";

import { networkConfig, suiClient } from "@/networkConfig";
import { State, User } from "@/type";

export const queryState = async () => {
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::contract::ProfileCreated`
        }
    })

    const state: State = {
        users: []
    }

    events.data.map((event) => {
        const user = event.parsedJson as User;
        state.users.push(user);
    })

    return state;
}

export const createProfileTx = async (name: string, description: string) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "contract",
        function: "create_profile_api",
        arguments: [
            tx.object(networkConfig.testnet.state),
            tx.pure.string(name),
            tx.pure.string(description),
        ]
    })

    return tx;
}