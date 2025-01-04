import { networkConfig, suiClient } from "@/networkConfig";
import { State, User } from "@/type";
import { Transaction } from "@mysten/sui/transactions";

export const queryState = async () => {
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::resource_manager::ProfileCreated`,
        }
    });
    const state: State = { users: [] }
    events.data.map((event) => {
        const user = event.parsedJson as User;
        state.users.push(user);
    })
    return state;
};

/*
public entry fun create_profile(name: String, description: String, state: &mut State, ctx: &mut TxContext) {
*/
export const createProfileTx = async (name: string, description: string) => {
    const tx = new Transaction();

    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "resource_manager",
        function: "create_profile",
        typeArguments: [],
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.state),
        ],
    });
    return tx;
};
