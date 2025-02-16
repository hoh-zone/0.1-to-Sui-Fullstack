import {networkConfig, suiClient} from "@/app/networkConfig";
import {State, User} from "@/type";
import {EventId} from "@mysten/sui/client";
import {Transaction} from "@mysten/sui/transactions";

export async function queryState(cursor: EventId | null | undefined) {
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::week1::ProfileCreated`
        },
        cursor
    });
    const state: State = {
        users: []
    };
    events.data.map((event) => {
        state.users.push(event.parsedJson as User);
    });
    if (events.hasNextPage) {
        state.users.concat((await queryState(events.nextCursor)).users);
    }
    return state;
}

export async function createProfileTx(name: string, description: string) {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "week1",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.stateID)
        ]
    });
    return tx;
}