import { IContent, IFolder, IProfile } from "@/type";
import { suiClient, networkConfig } from "../networkConfig";
import { SuiParsedData } from "@mysten/sui/client";

// 查询合约中的Event Structs
export const queryState = async () => {
  const events = await suiClient.queryEvents({
    query: {
      MoveEventType: `${networkConfig.testnet.packageID}::week_two::ProfileCreated`,
    },
  });
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

// 查询Folder
export const queryFolder = async (addresses: string[]) => {
  const result = await suiClient.multiGetObjects({
    ids: addresses,
    options: {
      showContent: true
    },
  });
  const folderArr = result.map((item) => {
    const content = item.data?.content as SuiParsedData
    if (!("fields" in content)) {
      throw new Error("Invalid profile data structure");
    }
    return content.fields as unknown as IFolder
  })
  return folderArr
};
