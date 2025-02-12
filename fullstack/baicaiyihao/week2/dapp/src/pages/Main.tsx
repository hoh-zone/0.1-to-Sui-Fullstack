import CreateProfile from "@/components/CreateProfile";
import ProfileCard from "@/components/ProfileCard";
import ProfileList from "@/components/ProfileList";
import { processObject } from "@/lib";
import { createProfileTx, queryCoinMetadata, queryFolders, queryObjects, queryProfile, queryState } from "@/lib/contracts";
import { suiClient } from "@/networkConfig";
import { DisplayProfile, State } from "@/type";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useCallback, useEffect, useState } from "react";

const Main = () => {
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currentUser = useCurrentAccount();
    const [state, setState] = useState<State | null>(null);
    const [displayProfile, setDisplayProfile] = useState<DisplayProfile | null>(null);

    const fetchData = useCallback(() => {
      const fetchData = async () => {
          const state = await queryState();
          const userProfile = state.users.find((user) => user.address === currentUser?.address)?.profile;
          if (userProfile && currentUser) {
            const profile = await queryProfile(userProfile);
            const objects = await queryObjects(currentUser.address);
            const processedObjects = processObject(objects);
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

            const folders = await queryFolders(profile.folders);
            setDisplayProfile({
              ...profile,
              ownerId: currentUser.address,
              folders: folders.map((folder) => ({
                id: folder.id,
                name: folder.name,
                description: folder.description
              })),
              assets: processedObjects
            });
          } else {
            setDisplayProfile(null);
          }
          setState(state);
      };
      fetchData();
    }, [currentUser]);

    useEffect(() => {
        fetchData();
    }, [currentUser]);
  
    const handleCreateProfile = async (name: string, description: string) => {
      try{
        if (!currentUser) {
          console.log("User not connected");
          return;
        }
        const tx = await createProfileTx(name, description);
        signAndExecuteTransaction({
          transaction: tx,
        }, {
          onSuccess: async (tx) => {
              await suiClient.waitForTransaction({
                  digest: tx.digest
              });
              console.log("Transaction executed successfully", tx.digest);
          },
          onError: (error) => {
            console.error(error);
          }
        });
      }catch(e){
        console.error(e);
      }
    };
  
  return (
    <div className="flex flex-row justify-between">
        <div className="w-3/4">
            <ProfileList state={state} />
        </div>
        <div className="w-1/4">
          {
            displayProfile ? (
              <div>
                <ProfileCard profile={displayProfile} />
              </div>
            ) : (
                <CreateProfile onSubmit={handleCreateProfile} />
            )
          }
        </div>
    </div>
  )
}

export default Main;