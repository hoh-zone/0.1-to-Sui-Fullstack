"use client";
import { IContent, IFolder } from "@/type";
import { Button } from "./ui/button";
import { SuiObjectData } from "@mysten/sui/client";
import Link from "next/link";

function Profile({
  currentUserProfile,
  coinList,
  nftList,
  folderList,
}: {
  currentUserProfile: IContent | undefined;
  coinList: SuiObjectData[];
  nftList: SuiObjectData[];
  folderList: IFolder[];
}) {
  return (
    <div className="flex flex-col gap-6 border-gray-200 rounded-lg w-full max-w-2xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tighter">Profile</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-md">
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Name
          </label>
          <p className="text-lg font-medium">{currentUserProfile?.name}</p>
        </div>

        <div className="p-4 bg-gray-50 rounded-md">
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Bio
          </label>
          <p className="text-lg">{currentUserProfile?.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
          <h2 className="text-lg font-medium">Coin</h2>
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
            {coinList.length}
          </span>
        </div>
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
          <h2 className="text-lg font-medium">NFT</h2>
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
            {nftList.length}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-md">
        <h2 className="text-lg font-medium">Folders</h2>
        <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
          {folderList.length}
        </span>
      </div>
      <Link href="/user">
        <Button className="w-full">Manage</Button>
      </Link>
    </div>
  );
}

export default Profile;
