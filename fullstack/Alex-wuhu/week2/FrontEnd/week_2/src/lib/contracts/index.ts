import { networkConfig, suiClient, suiGraphQLClient } from "@/networkConfig";
import { Folder, FolderData, Profile, State, SuiObject, User } from "@/type";
import { SuiObjectData, SuiObjectResponse, SuiParsedData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { isValidSuiAddress } from "@mysten/sui/utils";
import queryFolderDataContext from "./graphContext";

export const queryState: () => Promise<State> = async () => {
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::filling::ProfileCreated`
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

export const queryProfile = async (address: string) => {
    if (!isValidSuiAddress(address)) {
        throw new Error("Invalid profile address");
    }
    const profileContent = await suiClient.getObject({
        id: address,
        options: {
            showContent: true
        }
    })
    if (!profileContent.data?.content) {
        throw new Error("Profile content not found");
    }

    const parsedProfile = profileContent.data.content as SuiParsedData;
    if (!('fields' in parsedProfile)) {
        throw new Error("Invalid profile data structure");
    }

    const profile = parsedProfile.fields as Profile;
    if (!profile) {
        throw new Error("Failed to parse profile data");
    }



    return profile;
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

export const queryFolders = async (addresses: string[]) => {
    const folders = await suiClient.multiGetObjects({
        ids: addresses,
        options: {
            showContent: true
        }
    })
    const parsedFolders = folders.map((folder) => {
        const parsedFolder = folder.data?.content as SuiParsedData;
        if (!parsedFolder || !('fields' in parsedFolder)) {
            throw new Error('Invalid folder data structure');
        }
        return parsedFolder.fields as Folder;
    });
    return parsedFolders;
}

export const queryCoinMetadata = async (coinTypes: string) => {
    const coin = await suiClient.getCoinMetadata({
        coinType: coinTypes,
        })
    return coin;
}

export const queryFolderData = async (folder: string) => {
    const folderData = await suiClient.getDynamicFields({
        parentId: folder,
    })
    console.log(folderData);
    return folderData;
}

export const queryFolderDataByGraphQL = async (folder: string) => {
    const result = await suiGraphQLClient.query({
        query: queryFolderDataContext,
        variables: {
            address: folder
        }
    })
    const folderData: FolderData[] = result.data?.object?.dynamicFields?.nodes?.map((node) => {
        const nameJson = node.name as { json: { name: string } };
        const valueJson = node.value as { json: { value: string } }; // Changed unknown to string to match FolderData type
        return {
            name: nameJson.json.name,
            value: valueJson.json.value
        }
    }) ?? [];
    console.log(folderData);
    return folderData;
}

/*    public entry fun create_profile(
        name: String, 
        description: String, 
        state: &mut State,
        ctx: &mut TxContext
    )*/

export const createProfileTx = async (name: string, description: string) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "filling",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.state)
        ]
    })
    return tx;
}

export const createFolderTx = async (name: string, description: string, profile: string) => {
    if (!isValidSuiAddress(profile)) {
        throw new Error("Invalid profile address");
    }
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
    })
    return tx;
}

export const addCoinToFolderTx = async (folder: string, coin: string, coin_type: string,amount: number) => {
    if (!isValidSuiAddress(folder) || !isValidSuiAddress(coin)) {
        throw new Error("Invalid folder or coin address");
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
        typeArguments: [coin_type]
    })
    return tx;
}

