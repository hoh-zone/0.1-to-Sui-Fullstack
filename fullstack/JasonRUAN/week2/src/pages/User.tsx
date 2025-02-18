import FolderCard from "@/components/folder-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addCoinToFolderTx, createFolderTx, queryFolderDataByGraphQL, queryCoinMetadata } from "@/lib/contracts";
import { DisplayProfile, Folder, FolderData, SuiObject } from "@/type";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { formatModuleName } from "@/lib/utils";

const User = () => {
    const location = useLocation();
    
    // 如果没有 profile 数据，重定向到主页
    if (!location.state?.profile) {
        return <Navigate to="/" replace />;
    }

    const { profile } = location.state as { profile: DisplayProfile };
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
    const [assetAmounts, setAssetAmounts] = useState<Record<string, number>>({});
    const [folderData, setFolderData] = useState<FolderData[]>([]);
    const [metadataMap, setMetadataMap] = useState<Record<string, any>>({});

    const fetchCoinMetadata = async (coinType: string) => {
        if (!metadataMap[coinType]) {
            const metadata = await queryCoinMetadata(coinType);
            setMetadataMap(prev => ({
                ...prev,
                [coinType]: metadata
            }));
        }

        console.log(">>>", JSON.stringify(metadataMap, null, 2));
    };

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
        const folderData = await queryFolderDataByGraphQL(folder.id.id);
        setFolderData(folderData);
        
        for (const data of folderData) {
            await fetchCoinMetadata(data.name);
        }
    }
    const handleAddToFolder = async (asset: SuiObject) => {
        if (!selectedFolder){
            console.log("No folder selected");
            return;
        };
        const amount = assetAmounts[asset.id] || 0;
        const coinAmount = amount * 10 ** (asset.coinMetadata?.decimals || 0);
        const tx = await addCoinToFolderTx(selectedFolder.id.id, asset.id, asset.type, coinAmount);
        await signAndExecuteTransaction({
            transaction: tx,
        }, { onSuccess: () => {
            console.log("Asset added to folder successfully");
            setAssetAmounts(prev => {
                const newAmounts = { ...prev };
                delete newAmounts[asset.id];
                return newAmounts;
            });
        } });
    }
    return (
        <div className="w-full p-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Asset List */}
                    <div className="md:col-span-2">
                        <Tabs defaultValue={profile.assets ? Object.keys(profile.assets)[0] : ""}>
                            <TabsList>
                                {profile.assets && Object.keys(profile.assets).map((asset) => (
                                    <TabsTrigger key={asset} value={asset}>{asset}</TabsTrigger>
                                ))}
                            </TabsList>
                            {profile.assets && Object.entries(profile.assets).map(([assetType, assets]) => (
                                <TabsContent key={assetType} value={assetType}>
                                    <div className="space-y-4">
                                        {assets.map((asset, index) => (
                                            <div key={index} className="p-4 bg-gray-50 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                                <div className="flex flex-col items-start justify-between">
                                                    <p className="font-medium">Object ID: {asset.id}</p>
                                                    <p>Type: {asset.type}</p>   
                                                    {asset?.balance && asset.coinMetadata?.decimals && 
                                                        <p className="text-ellipsis text-blue-500">
                                                            Balance: {(asset.balance / 10 ** asset.coinMetadata?.decimals).toFixed(asset.coinMetadata.decimals)}
                                                        </p>
                                                    }
                                                </div>  
                                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                                    <Input 
                                                        type="number" 
                                                        placeholder="Amount" 
                                                        className="w-24" 
                                                        value={assetAmounts[asset.id] || ''} 
                                                        onChange={(e) => setAssetAmounts(prev => ({
                                                            ...prev,
                                                            [asset.id]: Number(e.target.value)
                                                        }))} 
                                                    />
                                                    <Button onClick={() => handleAddToFolder(asset)}>Add to folder</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>

                    {/* Right Column - Folder Card and Data */}
                    <div className="space-y-6">
                        <FolderCard 
                            folders={profile.folders} 
                            onFolderCreated={handleFolderCreated} 
                            onFolderSelected={handleFolderSelected} 
                        />

                        {folderData.length > 0 && (
                            <div className="bg-gray-50 p-4 rounded-md">
                                <h3 className="font-medium mb-4">Folder Contents</h3>
                                {folderData.map((data, index) => (
                                    <div key={index} className="border-b border-gray-200 py-2 last:border-0">
                                        <p className="font-medium">0x{formatModuleName(data.name)}</p>
                                        <p className="text-gray-600">
                                            {metadataMap[data.name] 
                                                ? (Number(data.value) / Math.pow(10, metadataMap[data.name].decimals)).toFixed(2)
                                                : Number(data.value)
                                            }
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default User;
