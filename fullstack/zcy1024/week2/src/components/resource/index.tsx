'use client'

import {useContext} from "react";
import {useRouter} from "next/navigation";
import {ResourceContext} from "@/contexts";

export default function Resource() {
    const router = useRouter();
    const [resource] = useContext(ResourceContext);

    return (
        <div className="flex justify-between items-center h-5/6 xl:px-20 2xl:px-52 mt-10">
            <div
                className="flex flex-col gap-5 h-full w-[66%] min-w-fit border border-gray-300 rounded-lg shadow p-1 text-xs">
                <div className="flex justify-between font-bold text-base bg-[#F0EAED] rounded-lg">
                    <span>Owner</span>
                    <span>Profile</span>
                </div>
                <div className="flex justify-between bg-[#FBF5F8] rounded-lg">
                    <span className="mr-10">{resource?.account}</span>
                    <span>{resource?.profile}</span>
                </div>
            </div>
            <div
                className="flex flex-col gap-5 items-center h-full w-[33%] min-w-fit border border-gray-300 rounded-lg shadow p-1">
                <div className="font-black text-2xl">Profile</div>
                <div className="flex justify-between gap-10 text-wrap">
                    <div className="flex flex-col gap-2 w-20 max-h-24 break-words">
                        <span className="text-gray-600 text-xs">Name</span>
                        <span className="font-semibold overflow-hidden">{resource?.profileContent?.name}</span>
                    </div>
                    <div className="flex flex-col gap-2 w-20 max-h-24 break-words">
                        <span className="text-gray-600 text-xs">Bio</span>
                        <span className="font-semibold overflow-hidden">{resource?.profileContent?.description}</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between">
                        <div className="flex justify-between w-24 mr-5">
                            <span>Coin</span>
                            <span className="border rounded-full bg-[#EDEFEA] px-1">{resource?.coins.length}</span>
                        </div>
                        <div className="flex justify-between w-24">
                            <span>NFT</span>
                            <span className="border rounded-full bg-[#EDEFEA] px-1">{resource?.NFTs.length}</span>
                        </div>
                    </div>
                    <div className="flex justify-between w-56">
                        <span>Folders</span>
                        <span className="border rounded-full bg-[#EDEFEA] px-1">{resource?.profileContent?.folders.length}</span>
                    </div>
                </div>
                <div className="border rounded-full bg-[#282725] px-10 text-[#D5D4D3] cursor-pointer"
                     onClick={() => router.push("/manage")}>Manage
                </div>
            </div>
        </div>
    )
}