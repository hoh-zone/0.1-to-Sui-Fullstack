

import { Transaction } from "@mysten/sui/transactions";
import { networkConfig, suiClient } from "../../networkConfig";
import { State, User } from "@/type";


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
    events.data.map((event) => {
        const user = event.parsedJson as User;
        state.users.push(user);
    })
    return state;
}

//query UserInfo
export const getUserInfo = async (profileID: string) => {
    try {
        const objRes = await suiClient.getObject({
            id: profileID,
            options: {
                showContent: true
            }
        });
        if (objRes.data?.content?.dataType === "moveObject") {
            const fields = objRes.data.content.fields as {
                name: string;
                description: string;
            };
            return {
                name: fields.name,
                description: fields.description
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null;
    }
}