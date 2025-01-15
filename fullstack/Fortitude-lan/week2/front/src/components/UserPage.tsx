import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addCoinToFolderTx,
  createFolderTx,
  queryFolderDataByGraphQL,
} from "@/lib/contracts";
import { DisplayProfile, State, Folder, FolderData, SuiObject } from "@/type";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const UserPage = ({
  state,
  profile,
}: {
  state: State;
  profile: DisplayProfile;
}) => {
  const { toast } = useToast();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [folderData, setFolderData] = useState<FolderData[]>([]);
  const handleFolderCreated = async ({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) => {
    const tx = await createFolderTx(name, description, profile.id.id);
    await signAndExecuteTransaction(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          console.log("Folder created successfully");
          toast({
            variant: "success",
            title: "Folder created successfully!",
          });
        },
      },
    );
  };
  const handleFolderSelected = async (folder: Folder) => {
    setSelectedFolder(folder);
    console.log(folder.id.id);
    const folderData = await queryFolderDataByGraphQL(folder.id.id);
    setFolderData(folderData);
  };
  const handleAddToFolder = async (asset: SuiObject) => {
    if (!selectedFolder) {
      console.log("No folder selected");
      toast({
        variant: "warning",
        title: "No folder selected",
        description: "Please create a folder first!",
      });
      return;
    }
    const coinAmount = amount * 10 ** (asset.coinMetadata?.decimals || 0);
    const tx = await addCoinToFolderTx(
      selectedFolder.id.id,
      asset.id,
      asset.type,
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
          {/* Left Column - Asset List */}
          <div className="md:col-span-2">
            <Tabs
              defaultValue={
                profile.assets ? Object.keys(profile.assets)[0] : ""
              }
            >
              <TabsList className="w-[110px] grid grid-cols-2 gap-10 mb-4">
                {profile.assets &&
                  Object.keys(profile.assets).map((asset) => (
                    <TabsTrigger
                      key={asset}
                      value={asset}
                      className="w-[70px] tab-trigger"
                    >
                      {asset}
                    </TabsTrigger>
                  ))}
              </TabsList>

              {profile.assets &&
                Object.entries(profile.assets).map(([assetType, assets]) => (
                  <TabsContent key={assetType} value={assetType}>
                    <div
                      className={`relative p-2 py-4 border-b-2 border-custom-blue`}
                    >
                      {assets.map((asset, index) => (
                        <div key={index}>
                          <p className="font-medium mb-6">
                            Object ID: {asset.id}
                          </p>
                          <div className="flex items-center justify-between ">
                            <p>Type: {asset.type}</p>
                            {asset?.balance && asset.coinMetadata?.decimals && (
                              <p className="text-ellipsis text-custom-blue">
                                Balance:
                                {(
                                  asset.balance /
                                  10 ** asset.coinMetadata?.decimals
                                ).toFixed(asset.coinMetadata.decimals)}
                              </p>
                            )}
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                              <Input
                                type="number"
                                placeholder="Amount"
                                className="w-20 h-8"
                                value={amount}
                                onChange={(e) =>
                                  setAmount(Number(e.target.value))
                                }
                              />
                              {/* <Button onClick={() => handleAddToFolder(asset)}>
                                Add to folder
                              </Button> */}
                              <button
                                onClick={() => handleAddToFolder(asset)}
                                className="px-2 bg-gradient-to-br relative group/btn from-custom-blue dark:from-zinc-900 dark:to-zinc-900 to-black-100 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                                type="submit"
                              >
                                Add to folder
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
            </Tabs>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default UserPage;
