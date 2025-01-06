
import { Transaction } from "@mysten/sui/transactions";
import { networkConfig, suiClient } from "../../networkConfig";
import { State, User } from "@/type";

export const queryInfo = async (profileID: string) => {
    const info = await suiClient.getObject({
        id: profileID,
        options: { showContent: true }
    })
    console.log(info)
    return info?.data?.content?.fields
}

export const createProfileTx = async (
    name: string,
    description: string,
) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "week_one_alt",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.state)
        ]
    })
    return tx;
}

export const queryState = async () => {
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::week_one_alt::ProfileCreated`
        }
    })
    const state: State = {
        users: []
    }
    console.log(events.data)
    events.data.map((event) => {
        const user = event.parsedJson as User;
        state.users.push(user);
    })

    return state;
}
