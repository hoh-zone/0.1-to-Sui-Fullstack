import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { createProfileTx, queryState } from "@/contracts/query";
import { State } from "./type";
import { WalletStatus } from "./WalletStatus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import './index.css';


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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted-background">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Profile Manage
              </span>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Create Profile
              </CardTitle>
              <p className="text-muted-foreground">
                Let us know about yourself to create your profile
              </p>
            </CardHeader>
            
            <CardContent>
              {currentUser && hasProfile ? (
                <WalletStatus />
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself"
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <Button 
                    className="w-full"
                    onClick={handleCreateProfile}
                  >
                    Create Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default App;
