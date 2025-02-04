import { queryFolder, queryObject } from "@/constract";
import { SuiObjectData } from "@mysten/sui/client";

// 查询 Coin和NFT
const getCoinAndNftList = async (address: string) => {
  const ownObject = await queryObject(address);
  if (ownObject.length) {
    // 分开Coin和NFT
    const coinArr: SuiObjectData[] = [];
    const nftArr: SuiObjectData[] = [];
    ownObject.forEach((item) => {
      const suiObject = item.data as SuiObjectData;
      if (suiObject.type!.includes("0x2::coin::Coin")) {
        coinArr.push(suiObject);
      } else {
        nftArr.push(suiObject);
      }
    });
    return { coinArr, nftArr };
  }
};
// 查询Folder
const getFolderList = async (folderArr: string[]) => {
  const folders = await queryFolder(folderArr);
  return folders;
};

export { getCoinAndNftList, getFolderList };
