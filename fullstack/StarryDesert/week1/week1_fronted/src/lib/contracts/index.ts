import { networkConfig, suiClient } from "@/networkConfig";
import { State, User } from "@/type";
import { Transaction } from "@mysten/sui/transactions";
import { isValidSuiAddress } from "@mysten/sui/utils";
import { SuiObjectResponse, SuiEvent } from "@mysten/sui/client";
import { categorizeSuiObjects, CategorizedObjects } from "@/utils/assetsHelpers";

export const queryState = async () => {
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::week_one::ProfileCreatedEvent`
        }
    });
    const state: State = {
        users: []
    };
    events.data.map((event: SuiEvent) => {
        const parsedJson = event.parsedJson as { owner: string; profile: string };
        const user: User = {
            owner: parsedJson.owner,
            profile: parsedJson.profile
        };
        state.users.push(user);
    });
    return state;
};

export const createProfileTx = async (name: string, description: string) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "week_one",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.userServer)
        ]
    });
    return tx;
};

export const getUserProfile = async (address: string): Promise<CategorizedObjects> => {
    if (!isValidSuiAddress(address)) {
        throw new Error("Invalid Sui address");
    }

    console.log("Fetching objects for address:", address);

    try {
        let hasNextPage = true;
        let nextCursor: string | null = null;
        let allObjects: SuiObjectResponse[] = [];

        while (hasNextPage) {
            const response: any = await suiClient.getOwnedObjects({
                owner: address,
                options: {
                    showContent: true,
                    showType: true,
                },
                cursor: nextCursor,
            });

            console.log("Received response:", response);

            allObjects = allObjects.concat(response.data);
            hasNextPage = response.hasNextPage;
            nextCursor = response.nextCursor ?? null;
        }

        const categorized = categorizeSuiObjects(allObjects);
        console.log("Categorized objects:", categorized);
        return categorized;
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        throw error;
    }
};
