import ProflieCard from "@/components/ProfileCard";
import {
  queryProfile,
  queryState,
  createProfile,
  queryFolders,
  queryObjects,
  queryCoinMetadata
} from "@/contracts";
import { useCallback, useEffect, useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { DisplayProfile, State } from "@/type";
import CreateProfile from "@/components/CreateProfile";
import { processObject } from "@/lib";

const Main = () => {
  const account = useCurrentAccount();
  const [profile, setDisplayProfile] = useState<DisplayProfile | null>(null);
  const [state, setState] = useState<State | null>(null);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const fetchState = useCallback(async () => {
    const state = await queryState();
    const userProfile = state.users.find((user) => user.owner === account?.address)?.profile;
    if (account && userProfile) {
        const profile = await queryProfile(userProfile);
        const objects = await queryObjects(account.address);
        const folders = await queryFolders(profile.floder);
        
        const processedObjects = processObject(objects);
        
        // Fetch coin metadata first
        // 对 processedObjects.Coin 数组中的每个 coin 对象进行异步操作，
        // 获取每个 coin 对应的元数据，并将其附加到 coin 对象中，
        // 然后将更新后的结果赋值回 processedObjects.Coin。
        if (processedObjects.Coin) {
            const updatedCoins = await Promise.all(
                processedObjects.Coin.map(async (coin) => {
                    const coinMetadata = await queryCoinMetadata(coin.type);
                    return {
                        ...coin,
                        coinMetadata: coinMetadata || undefined
                    };
                })
            );
            processedObjects.Coin = updatedCoins;
        }

        setState(state);
        setDisplayProfile({
            ...profile,
            ownerId: account.address,
            folders: folders.map((folder) => ({
                id: folder.id,
                name: folder.name,
                description: folder.description
            })),
            assets: processedObjects
        });
    }
   
}, [account]);

useEffect(() => {
    fetchState();
    if (!account) {
        setDisplayProfile(null);
    }
}, [account])

  const handleCreatedProfile = async (name: string, description: string) => {
    if (!account) {
      console.log("User not connected");
      return;
    }
    const tx = await createProfile(name, description);
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          console.log("success");
        },
        onError: () => {
          console.log("Error");
        },
      },
    );
  };

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8 flex gap-4">
        <div className="flex flex-col border-gray-200 p-4 rounded-md">
          {/* Only show this section if profile exists */}
          {profile && (
            <>
              <div className="flex items-center justify-between bg-gray-200 p-4 rounded-md gap-4 font-bold">
                <h1>Owner</h1>
                <p>Profile</p>
              </div>

              {state?.users.map((user) => {
                return (
                  <div
                    key={user.owner}
                    className="flex items-center justify-between bg-gray-100 p-4 rounded-md gap-4"
                  >
                    <h1>{user.owner}</h1>
                    <p>{user.profile}</p>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Render CreateProfile if profile doesn't exist */}
        {profile ? (
          <ProflieCard profile={profile} />
        ) : (
          <div className="flex justify-center">
            <CreateProfile onSubmit={handleCreatedProfile} />
          </div>
        )}
      </main>
    </div>
  );
};
export default Main;
