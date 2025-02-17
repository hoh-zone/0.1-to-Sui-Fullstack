import { networkConfig, suiClient } from "../config/networkConfig";
import {
  UserLikes,
  User,
  UserState,
  ArtworkOwner,
  DynamicObjet,
  SuiObject
} from "./constants";
import { Transaction } from "@mysten/sui/transactions";
import { isValidSuiAddress } from "@mysten/sui/utils";
import { SuiParsedData, DynamicFieldInfo } from "@mysten/sui/client";

export const queryState = async () => {
  const events = await suiClient.queryEvents({
    query: {
      MoveEventType: `${networkConfig.testnet.packageID}::artwork::ArtworkCreated`,
    },
  });
  let index:number = 0;
  const state:string[] = [];
  events.data.map((event) => {
    const artworkOwner = event.parsedJson as ArtworkOwner;
    state[index] = artworkOwner.artwork;
    index+=1;
  });
  return state;
};

export const queryUser = async () => {
  const events = await suiClient.queryEvents({
    query: {
      MoveEventType: `${networkConfig.testnet.packageID}::artwork::ProfileCreated`,
    },
  });
  const userState: UserState = {
    users: [],
  };
  events.data.map((event) => {
    const user = event.parsedJson as User;
    userState.users.push(user);
  });
  return userState;
};

export const createProfile = async () => {
  const tx = new Transaction();
  tx.moveCall({
    package: networkConfig.testnet.packageID,
    module: "artwork",
    function: "create_profile",
    arguments: [tx.object(networkConfig.testnet.state)],
  });
  return tx;
};



export const queryObj = async <T>(address: string) => {
  if (!isValidSuiAddress(address)) {
    throw new Error("Invalid Object address");
  }
  const objContent = await suiClient.getObject({
    id: address,
    options: {
      showContent: true,
    },
  });
  if (!objContent.data?.content) {
    throw new Error("queryObj content not found");
  }

  const parsedObj = objContent.data.content as SuiParsedData;
  if (!("fields" in parsedObj)) {
    throw new Error("Invalid queryObj data structure");
  }

  const obj = parsedObj.fields as T;
  if (!obj) {
    throw new Error("Failed to parse queryObj data");
  }
  console.log("obj", obj);
  return obj;
};

export const queryObjs = async <T>(addresses: string[]) => {
  const objects = await suiClient.multiGetObjects({
    ids: addresses,
    options: {
      showContent: true,
    },
  });
  const parseds = objects.map((obj) => {
    const parsed = obj.data?.content as SuiParsedData;
    if (!parsed || !("fields" in parsed)) {
      throw new Error("Invalid obj data structure");
    }
    return parsed.fields as T;
  });
  return parseds;
};

export const likeArtwork = async (artwork: string, profileId: string) => {
  console.log("likeArtwork", artwork, profileId);
  const tx = new Transaction();
  tx.moveCall({
    package: networkConfig.testnet.packageID,
    module: "artwork",
    function: "like",
    arguments: [
      tx.object(profileId),
      tx.object(artwork),
      tx.splitCoins(tx.gas, [10000000]),
    ],
  });
  return tx;
};

export const unLikeArtwork = async (artwork: string, profileId: string) => {
  console.log("unLikeArtwork", profileId);
  const tx = new Transaction();
  tx.moveCall({
    package: networkConfig.testnet.packageID,
    module: "artwork",
    function: "cancel_like",
    arguments: [tx.object(profileId), tx.object(artwork)],
  });
  return tx;
};

export const queryDynamicData = async (id: string) :Promise<UserLikes>=> {
  const table = await suiClient.getDynamicFields({
    parentId: id,
  });
  let datas = table.data;
  let objects:UserLikes = {
    likes:[],
    likeBalance:new Map<string, number>(),
  }
  try {
    for (let i = 0; i < datas.length; i++) {
      const dynamicObject = datas[i] as DynamicFieldInfo;
      let obj = await queryObj<DynamicObjet>(dynamicObject.objectId);
      objects.likes[i]=obj.name;
      objects.likeBalance.set(obj.name, obj.value);
    }
    return objects;
  } catch (error) {
    console.error("Failed to query objects:", error);
    throw new Error("Failed to fetch owned objects");
  }
};


export const processObject = (objects: SuiObject[]): Record<string, SuiObject[]> => {
  const result: Record<string, SuiObject[]> = {
      'Coin': [],
      'NFT': []
  };
  objects.forEach((object) => {
      if (object.type.includes('0x2::coin::Coin')) {
          object.type = object.type.match(/<(.+)>/)?.[1] || object.type;
          result['Coin'].push(object);
      } else {
          result['NFT'].push(object);
      }
  });
  return result;
}
