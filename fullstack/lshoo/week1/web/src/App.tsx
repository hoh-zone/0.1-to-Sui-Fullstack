import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { useState, useEffect } from "react";


import { queryState } from "./lib/contracts";
import { State } from "./type";

import { CreateProfile } from "./components/CreateProfile";
import { WalletStatus } from "./components/WalletStatus";

function App() {

  const [state, setState] = useState<State | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const currentUser = useCurrentAccount();

  useEffect(()=>{
    const fetchState = async()=>{
      const state = await queryState();
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
  }, [currentUser])


  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Common Learning for Sui Week 1
              </span>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            
            {currentUser && hasProfile?<WalletStatus />: <CreateProfile />}
            
          </div>
        </div>
      </main>
    </div>
  );
}
export default App;
