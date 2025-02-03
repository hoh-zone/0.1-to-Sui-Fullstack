
import {useState} from "react";

import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { createProfileTx } from "../lib/contracts";

export function CreateProfile(){
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const {mutate: signAndExecute} = useSignAndExecuteTransaction();
    const currentUser = useCurrentAccount();

    const handleCreateProfile = async()=>{
        if(!currentUser){
          return;
        }
        const tx = await createProfileTx(name, description);
        signAndExecute({
          transaction: tx
        }, {
          onSuccess: () => {
            console.log("Profile created");
          },
          onError: (error) => {
            console.log(error);
          }
        });
      }
    

    return (
        <p>
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold tracking-tighter">Create Profile</h1>
                <p className="text-muted-foreground">
                Enter your details to create your on-chain profile
                </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Bio
                </label>
                <textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              <button
                onClick={handleCreateProfile}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                Create Profile
              </button>
            </div>
        </p>
    )
}

