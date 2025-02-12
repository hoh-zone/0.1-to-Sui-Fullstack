import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SuiObject } from "@/type"

interface ObjectListProps {
    assetsMap: Record<string, SuiObject[]>,
    setAmount: (amount: number) => void
    handleAddToFolder: (asset: SuiObject) => void
}

const ObjectList = ( {assetsMap, setAmount, handleAddToFolder} : ObjectListProps ) => {
    console.log(assetsMap)
    return (
        <div className="bg-gray-700 w-full md:col-span-2">
            <Tabs defaultValue={assetsMap ? Object.keys(assetsMap)[0] : ""}>
                <TabsList>
                    {assetsMap && Object.keys(assetsMap).map((assetType) => (
                        <TabsTrigger key={assetType} value={assetType}>{assetType}</TabsTrigger>
                    ))}
                </TabsList>
                {assetsMap && Object.entries(assetsMap).map(([assetType, assets]) => (
                    <TabsContent key={assetType} value={assetType}>
                        <div className="space-y-4">
                             {assets.map((asset, index) => (
                                <div key={index} className="p-4 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex flex-col items-start justify-between">
                                        <p className="font-medium text-gray-200">Object ID: {asset.id}</p>
                                        <p className="text-gray-300">Type: {asset.type}</p>   
                                        {  asset.coinMetadata && asset.balance &&
                                            <p className="text-ellipsis text-blue-400">
                                                Balance: {(asset.balance / 10 ** asset.coinMetadata?.decimals).toFixed(asset.coinMetadata.decimals)}
                                            </p>
                                        }
                                    </div>  
                                    <div className="flex items-center gap-4 w-full sm:w-auto">
                                        {assetType == "Coin" && 
                                            <Input 
                                                type="number" 
                                                placeholder="Amount" 
                                                className="w-24 bg-gray-900 text-gray-200" 
                                                onChange={(e) => setAmount(Number(e.target.value))} 
                                            />
                                        }
                                        <Button 
                                            onClick={() => handleAddToFolder(asset)
                                        }>Add to folder</Button>
                                    </div>
                                </div>
                             ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default ObjectList;