import React, { useEffect, useState } from "react";


import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, DisplayProfile, State } from "@/type";
import { WalletStatus } from "@/components/WalletStatus";
import { useCurrentAccount } from "@mysten/dapp-kit";
import UserPage from "./UserPage";

interface ProfileDetailProps {
  profile: DisplayProfile;
  userInfoList: ExtendedUserInfo[];
  state: State;
}
interface ExtendedUserInfo extends User {
  name?: string;
  description?: string;
  owner: string;
  profile: string;
}

export function ProfileDetail({ profile, userInfoList, state }: ProfileDetailProps) {
  const currentUser = useCurrentAccount();

  return (
    <div className="w-[90%] h-screen-minus-80 overflow-y-hidden mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-transparent dark:bg-black">
      {/* <h2 className="h-[50px] text-center font-bold text-xl text-neutral-50 dark:text-neutral-200">
        Profiles
      </h2> */}
      <Tabs defaultValue="Profiles" className="">
        <TabsList className="w-[700px] h-[50px] grid grid-cols-3 gap-10 mb-20">
          <TabsTrigger value="Profiles" className="w-[200px] tab-trigger text-xl">
            Profile List
          </TabsTrigger>
          <TabsTrigger value="Mycoin" className="w-[200px] tab-trigger text-xl">
            My Coin
          </TabsTrigger>
          <TabsTrigger value="Address" className="tab-trigger text-xl">
            Wallet Status
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Profiles">
          <ul className="h-prop-minus-80 overflow-y-scroll custom-scrollbar px-4">
            {userInfoList?.length &&
              userInfoList.map((obj: any, idx: number) =>
                currentUser?.address === obj.owner ? (
                  <li
                    key={idx}
                    className={`relative p-2 py-4 border-b-2 border-custom-blue current-user`}
                  >
                    <div className="pb-4 text-custom-blue font-serif font-semibold">
                      ID: {obj.profile}
                    </div>
                    <div className="pb-2 text-cyan-50 font-mono">
                      Owner: {obj.owner}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="pb-2 text-cyan-50 font-mono">
                        Name: {obj.name}
                      </div>
                      <div className="pb-2 text-cyan-50 font-mono">
                        Desc: {obj.description}
                      </div>
                      {profile.assets &&
                        Object.entries(profile.assets).map(([key, value]) => (
                          <div className="pb-2 text-cyan-50 font-mono" key={`${key}-${value.length}`}>
                            {key} <span>{value.length}</span>
                          </div>
                        ))}
                      <div className="pb-2 text-cyan-50 font-mono">
                        Folders: {profile.folders.length}
                      </div>
                    </div>
                  </li>
                ) : (
                  <li
                    key={idx}
                    className={`relative p-2 py-4 border-b-2 border-custom-blue`}
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
                ),
              )}
          </ul>
        </TabsContent>
        <TabsContent value="Mycoin">
          <UserPage state={state} profile={profile}/>
        </TabsContent>
        <TabsContent value="Address">
          <WalletStatus />
        </TabsContent>
      </Tabs>

      {/*  */}
    </div>
  );
}
