import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { Folder, FolderData, DisplayProfile, SuiObject } from "@/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  addCoinToFolder,
  createFolder,
  queryFolderDataByGraphQL,
} from "@/contracts";
import { useLocation } from "react-router-dom";
import FolderCard from "@/components/FolderCard";

const User = () => {
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const { profile } = useLocation().state as { profile: DisplayProfile };
  const [amount, setAmount] = useState<number>(0);
  const [amounts, setAmounts] = useState<Record<string, number>>({});
  const [folderData, setFolderData] = useState<FolderData[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);

  const handleCreateFolder = async ({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) => {
    if (!profile) {
      console.error("Profile is null");
      return;
    }
    const tx = await createFolder(profile.id.id, name, description);
    await signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          console.log("Folder created successfully");
        },
      },
    );
  };

  //多个Folder 选择其中一个
  const handleFolderSelected = async (folder: Folder) => {
    setSelectedFolder(folder);
    console.log(folder.id.id);
    const folderData = await queryFolderDataByGraphQL(folder.id.id);
    setFolderData(folderData);
  };

  const handleAddToFolder = async (assert: SuiObject) => {
    if (!selectedFolder) {
      console.error("No folder selected");
      return;
    }
    const coinAmount = amount * 10 ** (assert.coinMetadata?.decimals || 0);
    console.log(selectedFolder.id.id);
    console.log("assert.id",assert.id);
    
    const tx = await addCoinToFolder(
      selectedFolder.id.id,
      assert.id,
      assert.type,
      coinAmount,
    );
    await signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          console.log("Asset added to folder successfully");
        },
      },
    );
  };

  return (
    <div className="w-full p-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left */}
          <div className="md:col-span-2">
            <Tabs
              defaultValue={
                profile.assets ? Object.keys(profile.assets)[0] : ""
              }
            >
              <TabsList>
                {profile.assets &&
                  Object.keys(profile.assets).map((asset) => (
                    <TabsTrigger key={asset} value={asset}>
                      {asset}
                    </TabsTrigger>
                  ))}
              </TabsList>
              {profile.assets &&
                Object.entries(profile.assets).map(([assetType, assets]) => (
                  <TabsContent key={assetType} value={assetType}>
                    <div className="space-y-4">
                      {assets.map((asset, index) => (
                        <div
                          key={index}
                          className="p-4 bg-gray-50 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                          <div className="flex flex-col items-start justify-between">
                            <p className="font-medium">Object ID: {asset.id}</p>
                            <p>Type: {asset.type}</p>
                            {asset?.balance && asset.coinMetadata?.decimals && (
                              <p className="text-ellipsis text-blue-500">
                                Balance:{" "}
                                {(
                                  asset.balance /
                                  10 ** asset.coinMetadata?.decimals
                                ).toFixed(asset.coinMetadata.decimals)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-4 w-full sm:w-auto">
                            <input
                              type="number"
                              placeholder="Amount"
                              className="w-24 bg-white"
                              value={amounts[asset.id] || ""} // 用 asset.id 作为 key
                              onChange={(e) =>
                                setAmounts((prevAmounts) => ({
                                  ...prevAmounts,
                                  [asset.id]: Number(e.target.value),
                                }))
                              }
                            />
                            <Button onClick={() => handleAddToFolder(asset)}>
                              Add to folder
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
            </Tabs>
          </div>
          {/* Right */}
          <div className="space-y-6">
            <FolderCard
              folders={profile.folders}
              onSubmit={handleCreateFolder}
              onFolderSelected={handleFolderSelected}
            />

            {folderData.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-4">Folder Contents</h3>
                {folderData.map((data, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-200 py-2 last:border-0"
                  >
                    <p className="font-medium truncate">{data.name}</p>
                    <p className="text-gray-600">{Number(data.value)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default User;
