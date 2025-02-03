import { networkConfig, suiClient  } from "@/networkConfig";
import { State, User ,Profile,SuiObject,Folder,FolderData} from "@/type";
import { Transaction } from "@mysten/sui/transactions";
import { SuiObjectData, SuiObjectResponse,SuiParsedData,CoinMetadata } from "@mysten/sui/client";
import {isValidSuiAddress} from "@mysten/sui/utils";
import { SuiGraphQLClient } from '@mysten/sui/graphql';
import { graphql } from '@mysten/sui/graphql/schemas/2024.4';

const graphqlClient = new SuiGraphQLClient({
    // 测试网
    url: 'https://sui-testnet.mystenlabs.com/graphql',
    // 主网
    // url: 'https://sui-mainnet.mystenlabs.com/graphql'
});

// 获取folderData
export const queryFolderDataByGraphQL = async (folderAddress: string): Promise<FolderData[]> => {
    const query = `
        query FolderData($address: SuiAddress!) {
            object(address: $address) {
                dynamicFields {
                    name {
                        type
                        bcs
                    }
                    value {
                        content {
                            type
                            fields
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await graphqlClient.query({
            query,
            variables: {
                address: folderAddress
            }
        });

        // 转换查询结果为 FolderData[]
        const dynamicFields = response.data?.object.dynamicFields || [];
       const folderdata:FolderData[] =  dynamicFields.map((field: any) => ({
            name: field.name.type,  // 使用类型作为名称
            value: field.value.content.fields.balance || '0'  // 获取余额值
        }));
        return folderdata;

    } catch (error) {
        console.error('Error querying folder data:', error);
        throw error;
    }
};

//查询账户拥有的对象
export const queryOwnedObjects = async (address: string) => {
    if (!isValidSuiAddress(address)) {
        throw new Error("Invalid profile address");
    }
    let hasnextpage = true;
    let cursor: string | undefined = undefined;
    let responseobjects: SuiObjectResponse[] = [];
    let objects: SuiObject[] = [];

    while (hasnextpage) {
        const result = await suiClient.getOwnedObjects({
            owner: address,
            options: {
                showContent: true,
                showType: true,
            },
            cursor,
            limit: 50
        })

        hasnextpage = result.hasNextPage;
        cursor = result.nextCursor || undefined;
        responseobjects.push(...result.data);
    }
    responseobjects.map((object)=>{
        const objectData = object.data as SuiObjectData;
        let suiObject: SuiObject= {
            id:objectData.objectId,
            type:objectData.type || "",
        }
        if (objectData.content) {
            const parsedData = objectData.content as SuiParsedData;
            if (parsedData.dataType === 'moveObject') {
                const balance = parsedData.fields as unknown as { balance: string };
                suiObject.balance = parseInt(balance.balance);
            }
        }
        objects.push(suiObject);
    })
        return objects;
}

//查询注册的profile信息
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

export const queryCoinMetadata = async (coinTypes: string) => {
    const coin = await suiClient.getCoinMetadata({
        coinType: coinTypes,
        }) as CoinMetadata;
    return coin;
}

//查询State，并返回
export const queryState = async () => {
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::manage::ProfileCreated`
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

/*    public entry fun create_profile(
    name: String,
    description: String,
    state: &mut State,
    ctx: &mut TxContext,
)*/
//调用create_profile函数
export const createProfileTx = async (name: string, description: string) => {
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "manage",
        function: "create_profile",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(networkConfig.testnet.state)
        ]
    })
    return tx;
}


// public entry fun create_folder(
//     name: String,
//     description: String,
//     profile: &mut Profile,
//     ctx: &mut TxContext,
// ) {
//     let uid = object::new(ctx);
//     let id = object::uid_to_inner(&uid);
//     let fold_address = object::uid_to_address(&uid);
//     let owner = ctx.sender();
//     let folder = Folder {
//         id: uid,
//         name,
//         description,
//     };
//     transfer::transfer(folder, owner);
//     vector::push_back(&mut profile.folders, fold_address);
//     event::emit(FolderCreated { id, owner });
// }
export const createFolderTx = async (name: string, description: string, profile: string) => {
    if (!isValidSuiAddress(profile)) {
        throw new Error("Invalid Sui address");
    }
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "manage",
        function: "create_folder",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.object(profile)
        ]
    })
    return tx;
}
// public entry fun add_coin_to_folder<T>(coin: Coin<T>, folder: &mut Folder, ctx: &mut TxContext) {
//     let type_name = type_name::get<T>();
//     let amount = coin::value(&coin);
//     let total;
//     //在if里写没提示,exists_拼写错误
//     if (dynamic_field::exists_(&folder.id, type_name)) {
//         let pre_value = dynamic_field::borrow_mut<TypeName, Balance<T>>(
//             &mut folder.id,
//             type_name,
//         );
//         let balance = balance::join(
//             pre_value,
//             coin::into_balance(coin),
//         );
//         total = balance;
//     } else {
//         dynamic_field::add(&mut folder.id, type_name, coin::into_balance(coin));
//         total = amount;
//     };
//     event::emit(CoinWrapped {
//         folder: object::uid_to_address(&folder.id),
//         coin_type: type_name::into_string(type_name),
//         amount,
//         new_balance: total,
//     });
// }
export const addCoinToFolderTx = async (coin: string, folder: string, coin_type: string, amount: number) => {
    if (!isValidSuiAddress(folder) || !isValidSuiAddress(coin)) {
        throw new Error("Invalid Sui address");
    }
    const tx = new Transaction();
    const [depositCoin] = tx.splitCoins(tx.object(coin), [tx.pure.u64(amount)]);
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module: "manage",
        function: "add_coin_to_folder",
        arguments: [
            depositCoin,
            tx.object(folder)
        ],
        typeArguments: [coin_type]
    })
    return tx;
}