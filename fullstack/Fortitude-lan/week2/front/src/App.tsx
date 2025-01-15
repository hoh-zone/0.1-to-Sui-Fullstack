import { ConnectButton, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { FormCom, ProfileDetail, UserPage } from "@/components";
import logo1 from "@/assets/img/logo1.png";
import logo2 from "@/assets/img/logo2.png";
import { useCallback, useEffect, useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Toaster } from "@/components/ui/toaster";
import { DisplayProfile, State, User, UserInfo } from "@/type";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  createProfileTx,
  queryCoinMetadata,
  queryFolders,
  queryObjects,
  queryProfile,
  queryState,
} from "@/lib/contracts";
import { useToast } from "@/hooks/use-toast";

import { processObject } from "@/lib";
interface ExtendedUserInfo extends User {
  name?: string;
  description?: string;
  owner: string;
  profile: string;
}

function App() {
  const { toast } = useToast();
  const [state, setState] = useState<State | null>(null);
  const [displayProfile, setDisplayProfile] = useState<DisplayProfile | null>(
    null,
  );
  const [userInfoList, setUserInfoList] = useState<ExtendedUserInfo[]>([]);
  const currentUser = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const fetchState = useCallback(async () => {
    const state = await queryState();

    if (state?.users?.length) {
      const promises = state.users.map(async (obj: User) => {
        const info = await queryProfile(obj.profile);
        return {
          ...obj,
          ...info,
        };
      });
      const allInfo: ExtendedUserInfo[] = await Promise.all(promises);
      setUserInfoList(allInfo);
    }

    const userProfile = state.users.find(
      (user) => user.owner === currentUser?.address,
    )?.profile;

    if (currentUser && userProfile) {
      const profile = await queryProfile(userProfile);
      console.log(profile);
      const objects = await queryObjects(currentUser.address);
      const folders = await queryFolders(profile.folders);
      const processedObjects = processObject(objects);

      // Fetch coin metadata first
      if (processedObjects.Coin) {
        const updatedCoins = await Promise.all(
          processedObjects.Coin.map(async (coin) => {
            const coinMetadata = await queryCoinMetadata(coin.type);
            return {
              ...coin,
              coinMetadata: coinMetadata || undefined,
            };
          }),
        );
        processedObjects.Coin = updatedCoins;
      }

      setState(state);
      setDisplayProfile({
        ...profile,
        ownerId: currentUser.address,
        folders: folders.map((folder) => ({
          id: folder.id,
          name: folder.name,
          description: folder.description,
        })),
        assets: processedObjects,
      });
    }
  }, [currentUser]);

  useEffect(() => {
    fetchState();
    if (!currentUser) {
      setDisplayProfile(null);
    }
    console.log("displayProfile");
  }, [currentUser]);
  const handleCreateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    if (!currentUser) {
      console.log("User not connected");
      toast({
        variant: "destructive",
        title: "User not connected.",
        description: "Please connect wallet.",
      });
      return;
    }
    const tx = await createProfileTx(name, desc);
    tx.setGasBudget(1e7);
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          console.log("Profile created");
          toast({
            variant: "success",
            title: "Profile created Successfully!",
          });
          fetchState();
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  };
  return (
    <>
      <Toaster />
      <Router>
        <div className="flex justify-between p-4 px-10 h-[80px]">
          <h1>
            <img
              src={currentUser ? logo2 : logo1}
              alt=""
              className="h-[100%] "
            />
          </h1>
          <ConnectButton connectText="Connect Wallet" />
        </div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {displayProfile ? (
                  <ProfileDetail
                    state={state}
                    profile={displayProfile}
                    userInfoList={userInfoList}
                  />
                ) : (
                  <FormCom onSubmit={handleCreateProfile} />
                )}
              </>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
