import { IContent, IFolder, IFolderData, IProfile, ISuiParseData } from "@/type";
import { suiClient, networkConfig, suiGraphQLClient } from "../utils/networkConfig";
import { SuiParsedData } from "@mysten/sui/client";
import { graphql } from '@mysten/sui/graphql/schemas/latest';
// 查询合约中的Event Structs
export const queryState = async () => {
  const events = await suiClient.queryEvents({
    query: {
      MoveEventType: `${networkConfig.testnet.packageID}::week4::ProfileCreated`,
    },
  });
  // console.log("events", events)
  const state: IProfile[] = [];
  events.data.forEach((item) => {
    state.push(item.parsedJson as IProfile);
  });
  return state;
};

// 查询profile内容
export const queryProfile = async (profileId: string) => {
  const profileContent = await suiClient.getObject({
    id: profileId,
    options: {
      showContent: true,
    },
  });
  const content = profileContent.data?.content as SuiParsedData;
  if (!("fields" in content)) {
    throw new Error("Invalid profile data structure");
  }
  const profileField = content.fields as unknown as IContent;
  // console.log("profileField", profileField)
  return profileField;
};

// 查询链接钱包Coin和NFT
export const queryObject = async (address: string) => {
  const ownObject = await suiClient.getOwnedObjects({
    owner: address,
    options: {
      showContent: true,
      showType: true,
    },
  });
  return ownObject.data;
};

// 查询Coin元数据
export const queryCoinMetadata = async (coinType: string) => {
  const meatdata = await suiClient.getCoinMetadata({
    coinType: coinType
  })
  return meatdata
}

// 查询Folder
export const queryFolder = async (addresses: string[]) => {
  const result = await suiClient.multiGetObjects({
    ids: addresses,
    options: {
      showContent: true,
    },
  });
  const folderArr = result.map((item) => {
    const content = item.data?.content as SuiParsedData;
    if (!("fields" in content)) {
      throw new Error("Invalid profile data structure");
    }
    return content.fields as unknown as IFolder;
  });
  return folderArr;
};

export const queryFolderData = async (folder: string) => {
  const folderData = await suiClient.getDynamicFields({
      parentId: folder,
  })
  // console.log(folderData);
  return folderData;
}

const queryFolderDataContext = graphql(`
  query queryFolderDataContext($address:SuiAddress!) {
      object(address:$address){
          dynamicFields{
              nodes{
                  name{
                      json
                  }
                  value{
                  ...on MoveValue{
                          json
                      }
                  }
              }
          }
      }
  }
  `)

// 查询放入文件夹中的Coin
export const queryFolderDataByGraphQL = async (folderID: string) => {
  const result = await suiGraphQLClient.query({
      query: queryFolderDataContext,
      variables: {
          address: folderID
      }
  })
  const folderData: IFolderData = {
    coin: [],
    nft: []
  }
  result.data?.object?.dynamicFields?.nodes?.forEach((node) => {
      const value = node.value as {json: { value: string }}
      if(value && value.json) {
        console.log("node.value", node.value)
        const nameJson = node.name as { json: { name: string } };
        const valueJson = node.value as { json: { value: string } };
        folderData.coin.push({
          name: nameJson.json.name,
          value: valueJson.json.value
        })
      }else {
        const nameJson = node.name as { json:string };
        folderData.nft.push({
          name: nameJson.json,
          value: null
        })
      }
  });
  return folderData;
}


// 查询NFT type
export const queryNFTType = async (profileId: string) => {
  const profileContent = await suiClient.getObject({
    id: profileId,
    options: {
      showContent: true,
    },
  });
  const content = profileContent.data?.content as ISuiParseData;
  const type = content.type as string;
  return type;
};