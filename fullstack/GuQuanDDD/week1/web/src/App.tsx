import { ConnectButton } from "@mysten/dapp-kit";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { createProfileTx, queryState } from "./lib/contracts";
import { State } from "./type";
import { WalletStatus } from "./WalletStatus";

function App() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const {mutate: signAndExecute} = useSignAndExecuteTransaction();
  const [state, setState] = useState<State | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const currentUser = useCurrentAccount();

  useEffect(()=>{
    const fetchState = async()=>{
      const state = await queryState();
      console.log(state);
      setState(state);
    }
    fetchState();
    if(state){
      state.users.forEach((user)=>{
        if(user.owner === currentUser?.address){
          setHasProfile(true);
        }
      })
    }    
  },[currentUser])

  const handleCreateProfile = async()=>{
    if(!currentUser){
      console.log("User not connected");
      return;
    }
    const tx = await createProfileTx(name, description);
    signAndExecute({
      transaction: tx
    },{
      onSuccess: ()=>{
        console.log("Profile created");
      },
      onError: (error)=>{
        console.log(error);
      }
    });
  }

  return (
    <>
      <div className="w-full border-b">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">GuQuan</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ConnectButton />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-8">
        <div className="max-w-md mx-auto space-y-6">
          {hasProfile?<WalletStatus/>:<div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium">Description</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e)=>setDescription(e.target.value)}
                className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                placeholder="Enter your description"
              />
            </div>
            <button
              className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              onClick={handleCreateProfile}
            >
              Create Profile
            </button>
          </div>} 
        </div>
      </div>
    </>
  );
}

export default App;
