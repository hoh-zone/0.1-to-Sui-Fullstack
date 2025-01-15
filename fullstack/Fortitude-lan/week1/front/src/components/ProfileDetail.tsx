import React, { useEffect, useState } from "react";

import { createProfileTx, getUserInfo, queryState } from "@/lib/contracts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { User, UserInfo } from "@/type";
import { Container } from "lucide-react";
import { WalletStatus } from "@/components/WalletStatus";

export function ProfileDetail({ currentUser, state }: any) {
  const [userInfoList, setUserInfoList] = useState<Record<string, UserInfo>>(
    {},
  );
  useEffect(() => {
    console.log("sssssssssssssssss");
    const fetchUserDetails = async () => {
      if (state?.users?.length) {
        // 创建一个数组来存储所有异步请求
        const promises = state.users.map(async (obj: User) => {
          const info = await getUserInfo(obj.profile); // 查询用户详细信息
          return {
            ...obj,
            ...info,
          };
        });
        const allInfo: any = await Promise.all(promises);
        setUserInfoList(allInfo);
      }
    };
    fetchUserDetails();
  }, [state]);

  return (
    <div className="w-[90%] h-screen-minus-80 overflow-y-hidden mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-transparent dark:bg-black">
      {/* <h2 className="h-[50px] text-center font-bold text-xl text-neutral-50 dark:text-neutral-200">
        Profiles
      </h2> */}
      <Tabs defaultValue="Profiles" className="">
        <TabsList className="w-[400px] h-[50px] grid grid-cols-2 gap-10 mb-20">
          <TabsTrigger value="Profiles" className="tab-trigger text-xl">
            Profile List
          </TabsTrigger>
          <TabsTrigger value="Address" className="tab-trigger text-xl">
            Wallet Status
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Profiles">
          <ul className="h-prop-minus-80 overflow-y-scroll custom-scrollbar px-4">
            {userInfoList?.length &&
              userInfoList.map((obj: any, idx: number) => (
                <li
                  key={idx}
                  className="p-2 py-4 border-b-2 border-custom-blue"
                >
                  <div className="pb-4 text-custom-blue font-serif font-semibold">
                    ID: {obj.profile}
                  </div>
                  <div className="pb-2 text-cyan-50 font-mono">
                    Owner: {obj.owner}
                  </div>
                  <div className="pb-2 text-cyan-50 font-mono">
                    Name: {obj.name}
                  </div>
                  <div className="pb-2 text-cyan-50 font-mono">
                    Desc: {obj.description}
                  </div>
                </li>
              ))}
          </ul>
        </TabsContent>
        <TabsContent value="Address">
          <WalletStatus />
        </TabsContent>
      </Tabs>

      {/*  */}
    </div>
  );
}
