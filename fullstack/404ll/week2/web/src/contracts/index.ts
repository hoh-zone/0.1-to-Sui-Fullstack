import { networkConfig, suiClient, suiGraphQLClient } from "@/networkConfig";
import { Transaction } from "@mysten/sui/transactions";
import { isValidSuiAddress } from "@mysten/sui/utils";
import { Folder, Profile, State, SuiObject, User, FolderData } from "@/type";
import { SuiObjectData, SuiObjectResponse, SuiParsedData } from "@mysten/sui/client";
import queryFolderDataContext  from './queryFolderDataContext';


export const queryState :()=>Promise<State> =  async()=>{
    const events = await suiClient.queryEvents({
        query:{
            MoveEventType:`${networkConfig.testnet.packageID}::contract::ProfileCreated`
        }
    });
    //解析
    const state: State = {
        users:[]
    };
    // 解析事件数据并检查每个事件是否包含 profile 字段
    events.data.map((event) => {
      const user = event.parsedJson as User;
      if (user.profile) {
        state.users.push(user); // 确保只有包含 profile 的用户被添加
      } else {
        console.log("User profile not found:", user);
      }
    });
  
    console.log("State with users:", state); // 打印最终的 state.users
    return state;
  };


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

export const queryProfile = async(address:string)=>{
    if(!isValidSuiAddress(address)){
        throw new Error("Invalid profile address");
    }
    const profileContent = await suiClient.getObject({
        id: address,
        options:{
            showContent:true
        }
    })

    if (!profileContent.data?.content) {
        throw new Error("Profile content not found");
    }
    console.log("profile",profileContent);//此时返回值为一个object

    //拿出数据并简化
    const parsedProfile = profileContent.data.content as SuiParsedData;
    //检查
    if (!('fields' in parsedProfile)) {
        throw new Error("Invalid profile data structure");
    }

    const profile = parsedProfile.fields as Profile;
    if (!profile) {
        throw new Error("Failed to parse profile data");
    }

    return profile;
    
}

//拿到user用户的所有object
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

//folders是一个数组，需要一次性全部拿出来
export const queryFolders = async(addresses:string[])=>{
    const folders = await suiClient.multiGetObjects({
        ids: addresses,
        options:{
            showContent: true
        }
    })
    console.log("folders rwa",folders);
    //解析
    const parseFolders = folders.map((folder) => {
        const parsedFolder = folder.data?.content as SuiParsedData;
        if (!parsedFolder || !('fields' in parsedFolder)) {
            throw new Error('Invalid folder data structure');
        }
        return parsedFolder.fields as Folder;
    });
    return parseFolders;
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

export const queryCoinMetadata = async (coinTypes: string) => {
    const coin = await suiClient.getCoinMetadata({
        coinType: coinTypes,
        })
    return coin;
}

// public fun create_floder(profile: &mut Profile,name:String, description:String,ctx:&mut TxContext){
export const createFolder =async (profile:string, name:string, description:string) =>{
    const tx = new Transaction();
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module:"contract",
        function:"create_floder",
        arguments:[
            tx.object(profile),
            tx.pure.string(name),
            tx.pure.string(description),
        ]
    })
    return tx;
}


//public fun addCoinToFloder<T>(floder:&mut Floder, coin:Coin<T>, ctx:&mut TxContext)
export const addCoinToFolder = async (folder: string, coin: string, coin_type: string, amount: number)=>{
    if(!isValidSuiAddress(folder) ){
        throw new Error("inValid folder or coin address");
    }
    const tx = new Transaction();
    const [depositCoin] = tx.splitCoins(tx.object(coin),[tx.pure.u64(amount)]);
    tx.moveCall({
        package: networkConfig.testnet.packageID,
        module:"contract",
        function:"addCoinToFloder",
        arguments:[
            tx.object(folder),
            tx.object(depositCoin),
        ],
        typeArguments: [coin_type]
    })
    return tx;
}

