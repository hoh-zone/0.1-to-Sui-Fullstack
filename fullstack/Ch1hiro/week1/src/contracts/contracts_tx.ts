import { networkConfig, suiClient } from "../networkConfig";
import { Transaction } from "@mysten/sui/transactions";
import { State, User } from "../type/struct_type"

export const queryState = async () => {
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::resource_manage::ProfileCreated`
        }
    })
    const state:State = {
        users:[]
    }   
    events.data.map((event)=>{
        const user = event.parsedJson as User;
        state.users.push(user);
    })
    return state;
}

export const createProfile = async(name: string, description: string) => {
    const packageID = networkConfig.testnet.packageID;
    const state = networkConfig.testnet.State;
    
    const tx = new Transaction();
    tx.moveCall({
        package: packageID,
        module: "resource_manage",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(state),
        ],
    });
    
    return tx;
}
