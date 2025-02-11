import CreateProfile from "@/components/CreateProfile";
import NavBar from "@/components/NavBar";
import ProfileCard from "@/components/ProfileCard";
import ProfileList from "@/components/ProfileList";
import { useProfile } from "@/contexts/provider";
import { createProfileTx, queryState } from "@/lib/contracts";
import { suiClient } from "@/networkConfig";
import { State } from "@/type";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useCallback, useEffect, useState } from "react";

const Main = () => {
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currentUser = useCurrentAccount();
    const [state, setState] = useState<State | null>(null);
    const { profile: displayProfile,  refresh: refresh } = useProfile();

    const fetchState = useCallback(async () => {
        const state = await queryState();
        setState(state);
    }, []);

    useEffect(() => {
      fetchState();
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
              refresh();
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
    <div className="bg-gray-800 h-screen">
      <NavBar/>
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
    </div>
  )
}

export default Main;