import { OBJECT_TYPE } from "@/routes/task/constantas";
import { SuiObjectData } from "@mysten/sui/client";

export const isFolderObject = (obj: SuiObjectData) => obj.type === OBJECT_TYPE.Folder;
export const isProfileObject = (obj: SuiObjectData) => obj.type === OBJECT_TYPE.Profile;
export const isCoinObject = (obj: SuiObjectData) => obj.type?.startsWith("0x2::coin::Coin");
