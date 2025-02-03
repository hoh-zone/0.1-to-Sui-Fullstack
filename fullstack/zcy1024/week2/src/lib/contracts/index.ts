import {networkConfig, suiClient} from "@/app/networkConfig";
import {DynamicCoin, Folder, ProfileWithAddress, State, User} from "@/type";
import {CoinStruct, DynamicFieldInfo, EventId, SuiObjectResponse} from "@mysten/sui/client";
import {Transaction} from "@mysten/sui/transactions";

export async function queryState(cursor: EventId | null | undefined) {
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::${networkConfig.testnet.moduleName}::ProfileCreated`
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
        state.users = state.users.concat((await queryState(events.nextCursor)).users);
    }
    return state;
}

export async function queryProfile(profileID: string) {
    const res = await suiClient.getObject({
        id: profileID,
        options: {
            showContent: true
        }
    });
    return (res.data?.content as unknown as {
        fields: ProfileWithAddress
    }).fields;
}

export async function queryExactFolder(folderID: string) {
    const res = await suiClient.getObject({
        id: folderID,
        options: {
            showContent: true
        }
    });
    return (res.data?.content as unknown as {
        fields: Folder
    }).fields;
}

export async function queryFolderContents(profileWithAddress: ProfileWithAddress) {
    const folders: Folder[] = [];
    profileWithAddress.folders.map(async (folderID) => {
        folders.push(await queryExactFolder(folderID));
    });
    return {
        id: profileWithAddress.id,
        name: profileWithAddress.name,
        description: profileWithAddress.description,
        folders
    };
}

async function loopGetDynamicFields(folderID: string, cursor: string | undefined | null): Promise<DynamicFieldInfo[]> {
    const res = await suiClient.getDynamicFields({
        parentId: folderID,
        cursor
    });
    if (res.hasNextPage)
        return res.data.concat(await loopGetDynamicFields(folderID, res.nextCursor));
    return res.data;
}

export async function queryDynamicFields(folders: string[]) {
    const fields = new Map<string, DynamicCoin[]>();
    folders.map(async (folderID) => {
        const data = await loopGetDynamicFields(folderID, null);
        data.map(async (info) => {
            const res = await suiClient.getObject({
                id: info.objectId,
                options: {
                    showContent: true
                }
            });
            const content = res.data?.content as unknown as {
                fields: {
                    id: {
                        id: string
                    },
                    name: {
                        fields: {
                            name: string
                        }
                    },
                    value: string
                }
            };
            if (!fields.has(folderID)) {
                fields.set(folderID, [{
                    coinType: content.fields.name.fields.name,
                    coinBalance: content.fields.value
                }]);
            } else {
                fields.get(folderID)!.push({
                    coinType: content.fields.name.fields.name,
                    coinBalance: content.fields.value
                })
            }
        });
    });
    return fields;
}

export async function queryCoins(owner: string, cursor: string | null | undefined): Promise<CoinStruct[]> {
    const res = await suiClient.getAllCoins({
        owner,
        cursor
    });
    const data = res.data;
    if (res.hasNextPage)
        return data.concat(await queryCoins(owner, res.nextCursor));
    return data;
}

export async function queryNFTs(owner: string, cursor: string | null | undefined): Promise<SuiObjectResponse[]> {
    const res = await suiClient.getOwnedObjects({
        owner,
        cursor,
        options: {
            showContent: true,
            showDisplay: true
        }
    });
    const data = res.data;
    if (res.hasNextPage)
        return data.concat(await queryNFTs(owner, res.nextCursor)).filter(object => object.data?.display?.data);
    return data;
}

export async function createProfileTx(name: string, description: string) {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: networkConfig.testnet.moduleName,
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.stateID)
        ]
    });
    return tx;
}

export async function createFolderTx(name: string, description: string, profileID: string) {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: networkConfig.testnet.moduleName,
        function: "create_folder",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(profileID)
        ]
    });
    return tx;
}

export async function addCoinToFolderTx(folderID: string, coinID: string, coinType: string, amount: number) {
    const tx = new Transaction();
    const coin = tx.object(coinID);
    const [addCoin] = tx.splitCoins(coin, [tx.pure.u64(amount)]);
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: networkConfig.testnet.moduleName,
        function: "add_coin_to_folder",
        arguments: [
            tx.object(folderID),
            addCoin
        ],
        typeArguments: [
            coinType
        ]
    });
    return tx;
}