import { networkConfig, suiClient } from "@/networkConfig";
import { Transaction } from "@mysten/sui/transactions";

export const queryState = async()=>{
    const state = await suiClient.queryEvents({
        query:{
            MoveEventType:`${networkConfig.testnet.packageID}::contract::ProfileCreated`
        }
    });
    return state;
}

// public entry fun creat_profile(state: &mut State,name:String,description:String,ctx:&mut TxContext){
//     
// }

export const createProfile = async(name:string, description:string) =>{
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module:"contract",
        function:"creat_profile",
        arguments:[
            tx.object(networkConfig.testnet.stateID),
            tx.pure.string(name),
            tx.pure.string(description),
        ]
    })
    return tx;
}

