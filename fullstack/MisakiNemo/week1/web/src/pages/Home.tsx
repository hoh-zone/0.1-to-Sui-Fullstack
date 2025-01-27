import { ConnectButton } from "@mysten/dapp-kit";
import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { createProfileTx, queryState } from "@/lib/contracts/index.ts";
import { State } from "@/types/index.ts";
import WalletStatus from "@/components/WalletStatus.tsx";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Home = () => {
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
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 via-blue-500/10 to-transparent dark:from-blue-900 dark:via-blue-900/10 dark:to-gray-900">
            <div className="w-full border-b bg-white/10 backdrop-blur-xl dark:bg-gray-900/50 border-gray-200/20">
                <div className="container mx-auto">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 dark:from-blue-100 dark:to-white bg-clip-text text-transparent">
                                Misaki
                            </h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <ConnectButton />
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="container mx-auto py-12">
                <div className="max-w-md mx-auto">
                    {hasProfile ? (
                        <WalletStatus />
                    ) : (
                        <Card className="shadow-2xl bg-white/70 dark:bg-gray-900/50 backdrop-blur-lg border-gray-200/20">
                            <CardHeader>
                                <CardTitle className="bg-gradient-to-r from-blue-600 to-sky-400 bg-clip-text text-transparent">
                                    Create Profile
                                </CardTitle>
                                <CardDescription className="text-gray-600 dark:text-gray-300">
                                    Please fill in your profile information
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Description
                                    </label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Tell us about yourself"
                                        className="min-h-[100px] bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button 
                                    className="w-full bg-gradient-to-r from-blue-600 to-sky-400 hover:from-blue-700 hover:to-sky-500 text-white shadow-lg"
                                    onClick={handleCreateProfile}
                                    size="lg"
                                >
                                    Create Profile
                                </Button>
                            </CardFooter>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
