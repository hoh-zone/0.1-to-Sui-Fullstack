import { Folder } from '@/type';
import { useState } from 'react';

interface FolderCardProps {
    folders: Folder[];
    onCreateFolder: (name: string, description: string ) => void;
    onSelectFolder: (folder: Folder) => void;
}

const CreateFolder = ({ folders, onCreateFolder, onSelectFolder} : FolderCardProps) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const handleCreateFolder = () => {
        onCreateFolder(name, description);
    };
    const handleSelectFolder = (selectedFolder: string) => {
        const folder = folders.find((folder) => folder.name === selectedFolder);
        if (folder) {
            onSelectFolder(folder);
        }
    }
    return (
        <main className="flex flex-col">
            <div className="w-full max-w-md bg-gray-700 p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold text-gray-300 mb-4">Select Folder</h3>
                {folders.length > 0 && (
                    <div className="mb-4">
                        <label htmlFor="folder" className="block text-sm font-medium text-gray-300">
                        Select a folder
                        </label>
                        <select
                        id="folder"
                        onChange={(e) => handleSelectFolder(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                        <option value="" disabled selected>
                            Select a folder
                        </option>
                        {folders.map((folder) => (
                            <option key={folder.name} value={folder.name} className="bg-gray-800 text-white">
                            {folder.name}
                            </option>
                        ))}
                        </select>
                    </div>
                )}
                <h3 className="text-2xl font-bold text-gray-300 mb-4">Create Folder</h3>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Name
                    </label>
                    <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                    Description
                    </label>
                    <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter a description"
                    ></textarea>
                </div>

                <div className="flex justify-end w-full">
                    <button
                        type="button"
                        onClick={handleCreateFolder}
                        className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Create
                    </button>
                </div>
            </div>
        </main>
    )
}

export default CreateFolder;