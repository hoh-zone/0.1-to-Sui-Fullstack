import { networkConfig, suiClient} from "@/networkConfig";
import { Transaction } from "@mysten/sui/transactions";

// export const queryState = async() => {
//     const state = await suiClient.getObject({
//         id: networkConfig.devnet.state,
//         options: {
//             showContent: true,
//         }
//     })
//     return state;
// }

export const queryState = async () => {
    const state = await suiClient.queryEvents({
            query: {
                MoveEventType: `${networkConfig.testnet.packageID}::week_one_alt::ProfileCreated`
            }
        }
    )
    return state;
}

export const createProfileTx = async (name: string, description:string) =>{ 
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