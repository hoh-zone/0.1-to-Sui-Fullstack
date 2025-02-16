import { Cursor, Folder } from "@/routes/task/types";
import { CoinMetadata, DynamicFieldInfo, SuiClient, SuiObjectData } from "@mysten/sui/client";
import { uniq } from "lodash-es";
import { parseCoinId } from "./parse";

export const queryAllObjects = async (client: SuiClient, address: string) => {
  let hasNextPage = false;
  let cursor: Cursor = null;
  let data: SuiObjectData[] = [];

  try {
    do {
      const res = await client.getOwnedObjects({
        owner: address,
        options: { showContent: true, showType: true },
        limit: 50,
        cursor,
      });
      cursor = res.nextCursor;
      hasNextPage = res.hasNextPage;
      data = data.concat(res.data.filter((i) => !!i.data).map((i) => i.data as SuiObjectData));
    } while (hasNextPage);
    console.log("objects", data);
    return data;
  } catch (error) {
    console.error(error);
  }
  return [];
};

export const queryCoinMatedata = async (
  client: SuiClient,
  coinObjects: SuiObjectData[],
): Promise<Record<string, CoinMetadata>> => {
  try {
    const types = uniq(coinObjects.map((i) => i.type as string));
    const data = await Promise.all(types.map((type) => client.getCoinMetadata({ coinType: parseCoinId(type) })));
    return types.reduce((prev, type, i) => ({ ...prev, [type]: data[i] as CoinMetadata }), {});
  } catch (err) {
    console.error(err);
  }
  return {};
};

export const queryFolderCoins = async (client: SuiClient, folder: Folder) => {
  let hasNextPage = false;
  let cursor: Cursor = null;
  let data: DynamicFieldInfo[] = [];

  try {
    do {
      const res = await client.getDynamicFields({ parentId: folder.id.id, limit: 50, cursor });
      cursor = res.nextCursor;
      hasNextPage = res.hasNextPage;
      data = data.concat(res.data);
    } while (hasNextPage);

    const objects = await client.multiGetObjects({
      ids: data.map((i) => i.objectId),
      options: { showType: true, showContent: true },
    });

    return objects
      .filter((obj) => !!obj.data)
      .map((obj) => {
        const { id, name, value } = (obj.data?.content as any).fields;
        return { id: id.id, coinId: "0x" + name.fields.name, value };
      });
  } catch (error) {
    console.error(error);
  }
  return [];
};
