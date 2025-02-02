import { suiClient, networkConfig } from "@/networkConfig";
import { isValidSuiAddress } from "@mysten/sui/utils";
import { Transaction } from "@mysten/sui/transactions";
import { Folder, Profile, State, SuiObject, User } from "@/type";
import { SuiObjectData, SuiObjectResponse, SuiParsedData } from "@mysten/sui/client";


export const queryCoinMetadata = async (coinTypes: string) => {
    const coin = await suiClient.getCoinMetadata({
        coinType: coinTypes,
    });
    return coin;
}

export const queryObjects = async (address: string) => {
    if (!isValidSuiAddress(address)) {
        throw new Error("Invalid address");
    }

    try {
        let cursor: string | null | undefined = null;
        let hasNextPage = true;
        let objects: SuiObjectResponse[] = [];
        let suiObjects: SuiObject[] = [];

        while (hasNextPage) {
            const rawObjects = await suiClient.getOwnedObjects({
                owner: address,
                options: {
                    showContent: true,
                    showType: true // Add type info for better filtering
                },
                cursor,
                // Add limit to prevent too many requests
                limit: 50
            });

            if (!rawObjects?.data) {
                break;
            }

            hasNextPage = rawObjects.hasNextPage;
            cursor = rawObjects.nextCursor;
            objects.push(...rawObjects.data);
        }
        objects.map((object) => {
            const objectData = object.data as SuiObjectData
            const suiObject: SuiObject = {
                id: objectData.objectId,
                type: objectData.type || ""
            }
            if (objectData.content) {
                const parsedData = objectData.content as SuiParsedData;
                if (parsedData.dataType === 'moveObject') {
                    const balance = parsedData.fields as unknown as { balance: string };
                    suiObject.balance = parseInt(balance.balance);
                }
            }
            suiObjects.push(suiObject);
        })

        return suiObjects;
    } catch (error) {
        console.error("Failed to query objects:", error);
        throw new Error("Failed to fetch owned objects");
    }
}

export const queryState = async ()=>{
    // const state = await suiClient.getObject({
    //     id: networkConfig.testnet.stateID,
    //     options: {
    //         showContent: true,
    //     }
    // });
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::filling::ProfileCreated`
        }
    });
    const state: State = {
        users: []
    };
    events.data.map((event) => {
        const parsedJson = event.parsedJson as { owner: string; id: string };
        const user: User = {
            address: parsedJson.owner,
            profile: parsedJson.id,
        }
        state.users.push(user);
    });
    console.log(state);
    return state;

}

export const queryProfile = async (address: string) => {
    if (!isValidSuiAddress(address)) {
        throw new Error("Invalid profile address");
    }
    const profileContent = await suiClient.getObject({
        id: address,
        options: {
            showContent: true
        }
    });
    console.log(profileContent);

    if (!profileContent.data?.content) {
        throw new Error("Profile content not found");
    };

    const parsedProfile = profileContent.data.content as SuiParsedData;
    if (!('fields' in parsedProfile)) {
        throw new Error("Invalid profile data structure");
    };

    const profile = parsedProfile.fields as Profile;
    if (!profile) {
        throw new Error("Failed to parse profile data");
    };

    return profile;
}

export const queryFolders = async (addresses: string[]) => {
    const folders = await suiClient.multiGetObjects({
        ids: addresses,
        options: {
            showContent: true
        }
    });
    const parsedFolders = folders.map((folder) => {
        const parsedFolder = folder.data?.content as SuiParsedData;
        if (!parsedFolder || !('fields' in parsedFolder)) {
            throw new Error('Invalid folder data structure');
        }
        return parsedFolder.fields as Folder;
    });
    console.log(parsedFolders);
    return parsedFolders;
}



export const createProfileTx = async (name: string, description: string)=>{
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "filling",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.stateID)
        ]
    });
    return tx;
}

export const createFolderTx = async (name: string, description: string, profile: string)=>{
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "filling",
        function: "create_folder",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(profile)
        ]
    });
    return tx;
}

export const addCoinToFolderTx = async (folder: string, coin: string, coin_type: string, amount: number)=>{
    if (!isValidSuiAddress(folder) || !isValidSuiAddress(coin)) {
        throw new Error("Invalid SUI address");
    }
    const tx = new Transaction();
    const [depositCoin] = tx.splitCoins(tx.object(coin), [tx.pure.u64(amount)]);
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "filling",
        function: "add_coin_to_folder",
        arguments: [
            tx.object(folder),
            tx.object(depositCoin)
        ],
        typeArguments: [coin_type],
    });
    return tx;
}