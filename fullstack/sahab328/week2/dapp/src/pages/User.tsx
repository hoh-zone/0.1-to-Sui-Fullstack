import FolderCard from "@/components/FolderCard";
import ObjectList from "@/components/ObjectList";
import { queryFolderDataByGraphQL } from "@/lib";
import { addCoinToFolderTx, createFolderTx, queryState } from "@/lib/contracts";
import { suiClient } from "@/networkConfig";
import { DisplayProfile, Folder, FolderData, SuiObject } from "@/type";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const User = () => {
      const { profile } = useLocation().state as { profile: DisplayProfile };
      

      const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
      const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
      const [folderData, setFolderData] = useState<FolderData[]>([]);
      const [amount, setAmount] = useState(0);
    
      useEffect(() => {
        const fetchData = async () => {
          const state = await queryState();
          console.log(state);
        };
        fetchData();
      }, []);
    
      const handleCreateFolder = async (name: string, description: string) => {
        const tx = await createFolderTx(name, description, profile.id.id);
        signAndExecuteTransaction({
          transaction: tx,
        }, {
          onSuccess: async (tx) => {
            await suiClient.waitForTransaction({
                digest: tx.digest
            });
            console.log("Transaction executed successfully", tx.digest);
        },
          onError: (error) => {
            console.error(error);
          }
        });
      };

      const handleSelectFolder = async (folder: Folder) => {
        setSelectedFolder(folder);
        console.log(folder.id.id);
        const folderData = await queryFolderDataByGraphQL(folder.id.id);
        setFolderData(folderData);
      };

      const handleAddToFolder = async (asset: SuiObject) => {
        if (!selectedFolder){
            console.log("No folder selected");
            return;
        };
        const coinAmount = amount * 10 ** (asset.coinMetadata?.decimals || 0);
        console.log(selectedFolder.id.id, asset.id, asset.type, coinAmount);
        const tx = await addCoinToFolderTx(selectedFolder.id.id, asset.id, asset.type, coinAmount);
        await signAndExecuteTransaction({
            transaction: tx,
        }, {
          onSuccess: async (tx) => {
          await suiClient.waitForTransaction({
            digest: tx.digest
          });
          console.log("Transaction executed successfully", tx.digest);
        },
        onError: (error) => {
          console.error(error);
        }
        });
      };

      

    return (
      <div className="flex flex-row justify-between">
          <div className="w-3/4">
              <ObjectList assetsMap={profile.assets} setAmount={setAmount} handleAddToFolder={handleAddToFolder} />
          </div>
          <div className="w-1/4">
            <FolderCard folders={profile.folders} onCreateFolder={handleCreateFolder} onSelectFolder={handleSelectFolder} />
          </div>
      </div>
    )
  }

export default User;