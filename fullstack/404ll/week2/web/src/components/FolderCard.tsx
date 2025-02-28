import { Folder } from "@/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import CreateFolder from "./CreateFolder";
interface FolderCardPorps {
  folders: Folder[];
  onSubmit: ({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) => void;
  onFolderSelected: (folder: Folder) => void;
}

const FolderCard = ({
  folders,
  onSubmit,
  onFolderSelected,
}: FolderCardPorps) => {
  const handleFolderSelect = (folderName: string) => {
    const selectedFolder = folders.find((folder) => folder.name === folderName);
    if (selectedFolder) {
      onFolderSelected(selectedFolder);
    }
  };

  return (
    <div className="flex flex-col gap-4 border-2 border-gray-200 p-4 rounded-md">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Folder Manage</h1>
      </div>
      {folders.length > 0 && (
        <Select onValueChange={handleFolderSelect}>
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
      )}
      <Separator />
      <div className="flex flex-col gap-2 items-center justify-between">
        <CreateFolder onSubmit={onSubmit} />
      </div>
    </div>
  );
};

export default FolderCard;
