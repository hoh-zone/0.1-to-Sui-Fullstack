import { FolderData } from "@/type";

interface FolderListProps {
    assets: FolderData[];
    onRetrive: (asset: FolderData) => void;
}

const FolderList = ({ assets, onRetrive }: FolderListProps ) => {
    const handleRetrive = (asset: FolderData) => {
        onRetrive(asset);
    }
    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-gray-300">
            <h3 className="text-2xl font-bold mb-4">Objects in Folder</h3>
                <div>
                    {assets.map((asset, index) => (
                        <div key={index} className="bg-gray-800 flex flex-row mb-2">
                            <p className="px-4 py-2 flex-1">{asset.name}</p>
                            {asset.value[1] !== 'x' ? <p className="px-4 py-2 flex-1">{asset.value}MIST</p> : <p className="px-4 py-2 flex-1">{asset.value}</p>}
                            <button 
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
                                onClick={() => handleRetrive(asset)}>
                            Retrive
                            </button>
                        </div>
                    ))}
                </div>
        </div>
   );
}

export default FolderList;