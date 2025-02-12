import FolderCard from "@/components/FolderCard";
import FolderList from "@/components/FolderList";
import NavBar from "@/components/NavBar";
import ObjectList from "@/components/ObjectList";
import { useProfile } from "@/contexts/provider";
import { queryFolderDataByGraphQL } from "@/lib";
import { addCoinToFolderTx, addNFTToFolderTx, createFolderTx, removeCoinFromFolderTx, removeNFTFromFolderTx } from "@/lib/contracts";
import { suiClient } from "@/networkConfig";
import { Folder, FolderData, SuiObject } from "@/type";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

const User = () => {
  
      const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
      const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
      const [folderData, setFolderData] = useState<FolderData[]>([]);
      const [amount, setAmount] = useState(0);
      const { profile,  refresh } = useProfile();
      const currentUser = useCurrentAccount();
    
      useEffect(() => {
        refresh();
      }, []);
    
      const handleCreateFolder = async (name: string, description: string) => {
        if (!profile) return;
        const tx = await createFolderTx(name, description, profile.id.id);
        signAndExecuteTransaction({
          transaction: tx,
        }, {
          onSuccess: async (tx) => {
            await suiClient.waitForTransaction({
                digest: tx.digest
            });
            console.log("Transaction executed successfully", tx.digest);
            refresh();
        },
          onError: (error) => {
            console.error(error);
          }
        });
      };

      const handleSelectFolder = async (folder: Folder) => {
        setSelectedFolder(folder);
        const folderData = await queryFolderDataByGraphQL(folder.id.id);
        setFolderData(folderData);
        console.log(folderData);
      };

      const handleAddToFolder = async (asset: SuiObject) => {
        if (!selectedFolder){
            console.log("No folder selected");
            return;
        };
        if (asset.coinMetadata){
          const coinAmount = amount * 10 ** (asset.coinMetadata?.decimals || 0);
          const tx = await addCoinToFolderTx(selectedFolder.id.id, asset.id, asset.type, coinAmount);
          await signAndExecuteTransaction({
              transaction: tx,
          }, {
            onSuccess: async (tx) => {
            await suiClient.waitForTransaction({
              digest: tx.digest
            });
            refresh();
            console.log("Transaction executed successfully", tx.digest);
            const folderData = await queryFolderDataByGraphQL(selectedFolder.id.id);
            setFolderData(folderData);
          },
          onError: (error) => {
            console.error(error);
          }
          });
        } else {
          const tx = await addNFTToFolderTx(selectedFolder.id.id, asset.id, asset.type);
          console.log(tx);
          await signAndExecuteTransaction({
            transaction: tx,
          }, {
            onSuccess: async (tx) => {
            await suiClient.waitForTransaction({
              digest: tx.digest
            });
            console.log("Transaction executed successfully", tx.digest);
            refresh();
            const folderData = await queryFolderDataByGraphQL(selectedFolder.id.id);
            setFolderData(folderData);
          },
          onError: (error) => {
            console.error(error);
          }
          });
        }

      };
    
      const handleRetrive = async (asset: FolderData) => {
        if (!currentUser) {
            console.log("User not connected");
            return;
        }
        if (!selectedFolder){
            console.log("No folder selected");
            return;
        }
        if (asset.value[1] !== 'x'){
          const tx = await removeCoinFromFolderTx(selectedFolder.id.id, asset.name, currentUser.address);
          await signAndExecuteTransaction({
              transaction: tx,
          }, {
            onSuccess: async (tx) => {
            await suiClient.waitForTransaction({
              digest: tx.digest
            });
            refresh();
            console.log("Transaction executed successfully", tx.digest);
            const folderData = await queryFolderDataByGraphQL(selectedFolder.id.id);
            setFolderData(folderData);
          },
          onError: (error) => {
            console.error(error);
          }
          });
        } else {
          console.log(selectedFolder.id.id, asset.name, asset.value, currentUser.address);
          const tx = await removeNFTFromFolderTx(selectedFolder.id.id, asset.name, asset.value, currentUser.address);
          await signAndExecuteTransaction({
              transaction: tx,
          }, {
            onSuccess: async (tx) => {
            await suiClient.waitForTransaction({
              digest: tx.digest
            });
            refresh();
            console.log("Transaction executed successfully", tx.digest);
            const folderData = await queryFolderDataByGraphQL(selectedFolder.id.id);
            setFolderData(folderData);
          },
          onError: (error) => {
            console.error(error);
          }
          });
        }
      };

    return (
        <div className="bg-gray-800 h-screen">
            <NavBar/>
            {profile && (
            <div className="flex flex-row justify-between">
                <div className="w-3/4">
                    <ObjectList setAmount={setAmount} handleAddToFolder={handleAddToFolder} />
                </div>
                <div className="w-1/4">
                    <FolderCard onCreateFolder={handleCreateFolder} onSelectFolder={handleSelectFolder} />
                </div>
            </div>
            )}
            <FolderList assets={folderData} onRetrive={handleRetrive} />
        </div>
    )
  }

export default User;