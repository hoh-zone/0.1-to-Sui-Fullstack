import Navi_bar from "@/components/Navi_bar";

import { Button } from "@/components/ui/button"
import {  useCurrentAccount } from "@mysten/dapp-kit";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Folder, Coins, Image } from 'lucide-react'
import { queryProfile,queryOwnedObjects,queryCoinMetadata,queryFolders} from "@/contracts/query";
import { useEffect, useState } from "react";
import { createProfileTx, queryState } from "@/contracts/query";
import { State,DisplayProfile,SuiObject} from "@/type";
import { processObject } from "@/lib";
import { useNavigate } from "react-router-dom";



function UserProfilePage() {
  
  const navigate = useNavigate();
  const [state, setState] = useState<State | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [displayProfile, setDisplayProfile] = useState<DisplayProfile | null>(null);
  const currentUser = useCurrentAccount();
  const userInfo = state?.users.find((user) => user.owner === currentUser?.address);


  useEffect(() => {
    const fetchState = async () => {
      try {
        const state = await queryState();
        setState(state);
        const userInfo = state.users.find((user) => user.owner === currentUser?.address);
        setHasProfile(!!userInfo);
        
        if (currentUser && (userInfo as any)?.id) {
          const profile = await queryProfile((userInfo as any).id);
          const objects = await queryOwnedObjects(currentUser?.address as string);
          const folders = await queryFolders(profile.folders);
          const processed = processObject(objects);
          
  

          setDisplayProfile({
            id: { id: (userInfo as any).id },
            ownerId: currentUser.address,
            name: profile.name,
            description: profile.description,
            folders: folders,
            assets: processed
          });
        }
      } catch (error) {
        console.error("Error fetching state:", error);
      }
    };

    if (currentUser) {
      fetchState();
    }
  }, [currentUser]);
console.log(displayProfile)
  const userData = {
    name: displayProfile?.name ?? "未设置名称",
    description: displayProfile?.description ?? "未设置描述",
    nftCount: displayProfile?.assets?.NFT?.length ?? 0,
    coinCount: displayProfile?.assets?.Coin?.length ?? 0,
    folderCount: displayProfile?.folders?.length ?? 0,
    profileAddress: displayProfile?.id?.id ?? "未连接钱包",
    avatarUrl: "/placeholder.svg?height=100&width=100"
  }


  return (
    <div className="min-h-screen w-full bg-background">
      <Navi_bar />
      <main className="w-full min-h-[calc(100vh-64px)] bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={userData.avatarUrl} alt={userData.name} />
              <AvatarFallback><User className="w-10 h-10" /></AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{userData.name}</CardTitle>
              <p className="text-muted-foreground">{userData.description}</p>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              <span>NFT: {userData.nftCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-primary" />
              <span>代币: {userData.coinCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <Folder className="w-5 h-5 text-primary" />
              <span>文件夹: {userData.folderCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <span className="truncate" title={userData.profileAddress}>
                地址: {userData.profileAddress}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => {
                navigate(`/manage`, { state: { profile: displayProfile } })
            }}>
                查看文件夹
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

export default UserProfilePage;

