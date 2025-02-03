import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addCoinToFolderTx, createFolderTx, queryFolderDataByGraphQL ,queryFolders} from "@/contracts/query";
import Navi_bar from "@/components/Navi_bar";
import { DisplayProfile, Folder, FolderData, SuiObject } from "@/type";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useState } from "react";

import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const User = () => {
    const { profile } = useLocation().state as { profile: DisplayProfile };
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [assetAmounts, setAssetAmounts] = useState<Record<string, number>>({});
    const [folderData, setFolderData] = useState<FolderData[]>([]);
    const [folderName, setFolderName] = useState<string>("");
    const [folderDescription, setFolderDescription] = useState<string>("");

    const handleFolderCreated = async ({ name, description }: { name: string, description: string }) => {
        const tx = await createFolderTx(name, description, profile.id.id);
        await signAndExecuteTransaction({
            transaction: tx,
        }, { onSuccess: () => {
            console.log("Folder created successfully");
        } });
    }
    const handleFolderSelected = async (folder: Folder) => {
        setSelectedFolder(folder);
        console.log(folder.id.id);
        const folderData = await queryFolderDataByGraphQL(folder.id.id);
        setFolderData(folderData);
    }
    
    const handleAddToFolder = async (asset: SuiObject) => {
        if (!selectedFolder) {
            console.log("No folder selected");
            return;
        }
        const amount = assetAmounts[asset.id] || 0;
        const coinAmount = amount * 10 ** (asset.coinMetadata?.decimals || 0);
        const tx = await addCoinToFolderTx(
            asset.id,                    // coin
            selectedFolder.id.id,        // folder
            asset.type,                  // coin_type
            coinAmount                   // amount
        );
        await signAndExecuteTransaction({
            transaction: tx,
        }, { onSuccess: () => {
            console.log("Asset added to folder successfully");
        } });
    }

    const handleCreateFolder = () => {
        handleFolderCreated({ name: folderName, description: folderDescription });
        setFolderName("");
        setFolderDescription("");
    }

    const handleFolderSelect = (selectedFolder: string) => {
        const folder = profile.folders.find((folder) => folder.name === selectedFolder);
        if (folder) {
            handleFolderSelected(folder);
        }
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6">
            <Navi_bar />
            <div className="container mx-auto mt-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-3">
                        <Tabs defaultValue={profile.assets ? Object.keys(profile.assets)[0] : ""} className="bg-white rounded-lg shadow-sm p-4">
                            <TabsList className="flex flex-wrap p-1 bg-gray-100 rounded-md mb-4">
                                {profile.assets && Object.keys(profile.assets).map((asset) => (
                                    <TabsTrigger 
                                        key={asset} 
                                        value={asset}
                                        className="px-4 py-2 rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                                    >
                                        {asset}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            {profile.assets && Object.entries(profile.assets).map(([assetType, assets]) => (
                                <TabsContent key={assetType} value={assetType}>
                                    <div className="space-y-4">
                                        {assets.map((asset, index) => {
                                            console.log('Asset data:', asset);

                                            return (
                                                <div key={index} className="p-6 bg-white border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                        <div className="flex flex-col items-start gap-2 min-w-0 flex-1">
                                                            <p className="font-medium text-gray-900 truncate w-full">
                                                                Object ID: <span className="font-mono text-sm">{asset.id}</span>
                                                            </p>
                                                            <p className="text-gray-600 truncate w-full">
                                                                Type: <span className="font-medium">{asset.type}</span>
                                                            </p>   
                                                            {asset.hasOwnProperty('balance') && (
                                                                <p className="text-blue-600 font-medium">
                                                                    Balance: {asset.balance}
                                                                </p>
                                                            )}
                                                        </div>  
                                                        <div className="flex items-center gap-3 shrink-0">
                                                            <Input 
                                                                type="number" 
                                                                placeholder="Amount" 
                                                                className="w-24 focus:ring-2 focus:ring-blue-500" 
                                                                value={assetAmounts[asset.id] || ''} 
                                                                onChange={(e) => setAssetAmounts(prev => ({
                                                                    ...prev,
                                                                    [asset.id]: Number(e.target.value)
                                                                }))} 
                                                            />
                                                            <Button 
                                                                onClick={() => handleAddToFolder(asset)}
                                                                className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                                                            >
                                                                Add to folder
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>

                    <div className="md:col-span-1">
                        <div className="space-y-6 sticky top-6">
                            <div className="flex flex-col gap-4 border-2 border-gray-200 p-4 rounded-md bg-white shadow-sm">
                                <div className="text-center mb-2">
                                    <h1 className="text-xl font-bold tracking-tight">Folder Manage</h1>
                                </div>
                                {profile.folders.length > 0 && (
                                    <Select onValueChange={handleFolderSelect}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select a folder" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {profile.folders.map((folder) => (
                                                <SelectItem key={folder.name} value={folder.name}>
                                                    {folder.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                                <Separator />
                                <div className="flex flex-col gap-3">
                                    <Input 
                                        placeholder="Folder Name" 
                                        value={folderName} 
                                        onChange={(e) => setFolderName(e.target.value)} 
                                    />
                                    <Textarea 
                                        placeholder="Folder Description" 
                                        value={folderDescription} 
                                        onChange={(e) => setFolderDescription(e.target.value)} 
                                        className="min-h-[80px]"
                                    />
                                    <Button 
                                        className="w-full bg-blue-600 hover:bg-blue-700" 
                                        onClick={handleCreateFolder}
                                    >
                                        Create New Folder
                                    </Button>
                                </div>
                            </div>

                            {folderData.length > 0 && (
                                <div className="bg-white shadow-sm p-4 rounded-md border border-gray-200">
                                    <h3 className="font-medium mb-4 text-lg">Folder Contents</h3>
                                    <div className="space-y-2">
                                        {folderData.map((data, index) => (
                                            <div key={index} className="p-3 bg-gray-50 rounded-md">
                                                <p className="font-medium truncate text-sm">{data.name}</p>
                                                <p className="text-gray-600 text-sm">{Number(data.value)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User;