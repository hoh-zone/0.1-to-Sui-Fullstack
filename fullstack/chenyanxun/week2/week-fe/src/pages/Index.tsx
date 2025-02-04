import { useCurrentAccount } from "@mysten/dapp-kit";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import {
  queryProfile,
  queryState,
} from "@/constract";
import { IProfile, IContent, IFolder, IAssets } from "../type/index";
import { SuiObjectData } from "@mysten/sui/client";
import NoProfile from "@/components/NoProfile";
import Profile from "@/components/Profile";
import { getCoinAndNftList, getFolderList } from "@/hooks/useGetInfo";


function Index() {
  // 当前链接钱包
  const currentUser = useCurrentAccount();
  // 合约中profile Array
  const [profileList, setProfileList] = useState<IProfile[]>([]);
  // currentUser profile内容
  const [currentUserProfile, setCurrentUserProfile] = useState<IContent>();
  // 存放Coin和NFT
  const [coinList, setCoinList] = useState<SuiObjectData[]>([]);
  const [nftList, setNftList] = useState<SuiObjectData[]>([]);
  // 存放Folder
  const [folderList, setFolderList] = useState<IFolder[]>([]);
  // 监听 请求
  useEffect(() => {
    if (!currentUser) {
      setProfileList([]);
      setCurrentUserProfile(undefined);
      setCoinList([]);
      setNftList([]);
      setFolderList([]);
    } else {
      fetchData();
    }
  }, [currentUser]);
  // 当currentUser变化时，执行fetchData中的数据查询
  const fetchData = async () => {
    // 查询所有的profile
    const state = await queryState();
    setProfileList([...state]);
    // 如果profile Array中有当前链接钱包的地址，获取ID
    const currentUserProfileID = state.find(
      (item) => item.owner === currentUser?.address,
    )?.profile;
    // 如果有ID,获取链接钱包地址的profile具体内容,如果没有就要用户先填写
    if (currentUserProfileID) {
      // 获取当前钱包发送的profile内容
      const profile = await queryProfile(currentUserProfileID);
      setCurrentUserProfile(profile);

      const assets = (await getCoinAndNftList(currentUser!.address)) as IAssets;
      setCoinList(assets.coinArr);
      setNftList(assets.nftArr);
      const folders = await getFolderList(profile.folders)
      setFolderList([...folders]);
    }
  };

  return (
    <>
      <Header></Header>
      <div className="container mx-auto flex justify-between items-start mt-5">
        <div className="w-4/5 border-2 border-gray-200 p-3 rounded-md">
          <div className="flex justify-between items-center w-full bg-gray-200 font-bold p-3 rounded-md h-10">
            <div>Owner</div>
            <div>Profile</div>
          </div>
          {profileList.map((item) => {
            return (
              <div
                key={item.owner}
                className="flex justify-between items-center w-full bg-gray-100 p-3 rounded-md h-10 mt-2"
              >
                <div>{item.owner}</div>
                <div>{item.profile}</div>
              </div>
            );
          })}
        </div>
        <div className="w-1/5 border-2 border-gray-200 p-4 rounded-md ml-5">
          {currentUserProfile ? (
            <Profile
              currentUserProfile={currentUserProfile}
              coinList={coinList}
              nftList={nftList}
              folderList={folderList}
            />
          ) : (
            <NoProfile />
          )}
        </div>
      </div>
    </>
  );
}

export default Index;
