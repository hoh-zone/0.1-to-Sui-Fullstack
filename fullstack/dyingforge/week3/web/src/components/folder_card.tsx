import { Folder } from "@/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface FolderCardProps {
    folders: Folder[];
    onFolderCreated: ({ name, description }: { name: string, description: string }) => void;
    onFolderSelected: (folder: Folder) => void;
}

const FolderCard = ({ folders, onFolderCreated, onFolderSelected }: FolderCardProps) => {
    const [folderName, setFolderName] = useState<string>("");
    const [folderDescription, setFolderDescription] = useState<string>("");

    const handleCreateFolder = () => {
        onFolderCreated({ name: folderName, description: folderDescription });
        setFolderName("");
        setFolderDescription("");
    }

    const handleFolderSelected = (selectedFolder: string) => {
        const folder = folders.find((folder) => folder.name === selectedFolder);
        if (folder) {
            onFolderSelected(folder);
        }
    }
    return (
        <div className="flex flex-col gap-4 border-2 border-gray-200 p-4 rounded-md">
            <div className="text-center mb-4">
                <h1 className="text-2xl font-bold tracking-tight">Folder Manage</h1>
            </div>
            {folders.length > 0 && <Select onValueChange={handleFolderSelected}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a folder" />
                </SelectTrigger>
                <SelectContent>
                    {folders.map((folder) => (
                        <SelectItem key={folder.name} value={folder.name}>
                            {folder.name} 
                        </SelectItem>
                    ))}
                    </SelectContent>
                </Select>
            }
            <Separator />
            <div className="flex flex-col gap-2 items-center justify-between">
                <Input placeholder="Folder Name" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
                <Textarea placeholder="Folder Description" value={folderDescription} onChange={(e) => setFolderDescription(e.target.value)} />
                <Button className="w-full" onClick={handleCreateFolder}>
                    Create New Folder
                </Button>
            </div>
        </div>
    )
}

export default FolderCard;