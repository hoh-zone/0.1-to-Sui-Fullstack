import {networkConfig, suiClient} from "../config/networkConfig.ts";
import {Transaction} from "@mysten/sui/transactions";

export const queryAcBook = async (account_book_id:string) => {
    return await suiClient.getObject(
        {
            id: account_book_id,
            options:{
                showContent:true
            } 
        }
    )
}

export const queryAcbook = async (owner:string) => {
    const acbook = await suiClient.getOwnedObjects(
        {
            owner:owner,
            limit:10,
            cursor:'0x46e9bd0b0bff6984f94492c5ca41174a48df826bf264da26b81503af5b593d05'
        }
    )
    return acbook
}

export const queryDynamicFields = async (dynamicFields:string) => {
    return await suiClient.getDynamicFields(
        {
            parentId: dynamicFields
        }
    )
}

export const createProfile = async (name:string,stateID:string) => {
    const tx=new Transaction();
    tx.moveCall(
        {
            package: networkConfig.testnet.packageID,
            module: "stellar",
            function: "create_profile",
            arguments:[
                tx.pure.string(name),
                tx.object(stateID),
            ]
        }
    )
}