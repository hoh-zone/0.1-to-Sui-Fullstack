import { useAppModel } from "@/models/app-model";
import { useConfigModel } from "@/models/config-model";
import { Folder, Profile } from "@/routes/task/types";
import { queryAllObjects, queryCoinMatedata } from "@/routes/task/utils";
import { isCoinObject, isFolderObject, isProfileObject } from "@/routes/task/utils/match";
import { parseCoins, parseFields } from "@/routes/task/utils/parse";
import { useRequest } from "ahooks";
import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";

const useContainer = () => {
  const { client } = useConfigModel();
  const { address } = useAppModel();
  const [folder, setFolder] = useState<Folder>();

  const { data, loading, refresh } = useRequest(async () => {
    const objects = await queryAllObjects(client, address);

    const profileObject = objects.find(isProfileObject);
    const profile = parseFields<Profile>(profileObject);

    const folderObjects = objects.filter(isFolderObject);
    const folders = folderObjects.filter(Boolean).map((o) => parseFields(o) as Folder);

    const coinObjects = objects.filter(isCoinObject);
    const coinMetadataMap = await queryCoinMatedata(client, coinObjects);
    const coins = parseCoins(coinObjects, coinMetadataMap);

    return { profile, folders, coins, coinMetadataMap };
  });

  useEffect(() => {
    if (!data?.folders.length || !!folder) return;
    setFolder(data.folders[0]);
  }, [data]);

  return {
    ...data,
    folder,
    loading,
    refresh,
    setFolder,
  };
};

export const TaskModel = createContainer(useContainer);
export const useTaskModel = TaskModel.useContainer;
