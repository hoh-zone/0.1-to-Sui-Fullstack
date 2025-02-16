import {  useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { createProfileTx, queryState } from "@/contracts/query";
import { State } from "@/type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Navi_bar from "@/components/Navi_bar"
import '@/index.css';
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const {mutate: signAndExecute} = useSignAndExecuteTransaction();
  const [, setState] = useState<State | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const currentUser = useCurrentAccount();
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      if (currentUser?.address) {
        const state = await queryState();
        setState(state);
        if (state) {
          setHasProfile(state.users.some(user => user.owner === currentUser.address));
        }
      }
    };
    checkProfile();
  }, [currentUser]); 
  

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
        navigate('/user');
      },
      onError: (error)=>{
        console.log(error);
      }
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted-background">
      <Navi_bar />
      <main className="container mx-auto py-10">
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center space-y-1">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Create Profile
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {!currentUser ? (
                <div className="text-center">
                  Please connect your wallet first
                </div>
              ) : hasProfile ? (
                <div className="text-center space-y-4">
                  <div>You already have a profile. Redirecting...</div>
                  <Button 
                    className="w-full"
                    onClick={() => navigate('/user')}
                  >
                    Go to Profile
                  </Button>
                </div>
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
                    <label htmlFor="description" className="text-sm font-medium">
                      Description
                    </label>
                    <Textarea
                      id="description"
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

export default Register;