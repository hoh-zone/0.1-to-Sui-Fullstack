import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useCallback, useEffect, useState } from "react";
import { createProfileTx, queryCoinMetadata, queryFolders, queryObjects, queryProfile, queryState } from "@/lib/contracts";
import { DisplayProfile, State } from "@/type";
import CreateProfile from "@/components/create-profile";
import { processObject } from "@/lib";
import { suiClient } from "@/networkConfig";
import ProfileCard from "@/components/profile-card";

const Main = () => {
    const { mutate: signAndExecute } = useSignAndExecuteTransaction();
    const [state, setState] = useState<State | null>(null);
    const [displayProfile, setDisplayProfile] = useState<DisplayProfile | null>(null);
    const currentUser = useCurrentAccount();

    const fetchState = useCallback(async () => {
        const state = await queryState();
        const userProfile = state.users.find((user) => user.owner === currentUser?.address)?.profile;
        if (currentUser && userProfile) {
            const profile = await queryProfile(userProfile);
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
                            coinMetadata: coinMetadata || undefined
                        };
                    })
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
                    description: folder.description
                })),
                assets: processedObjects
            });
        }
       
    }, [currentUser]);

    useEffect(() => {
        fetchState();
        if (!currentUser) {
            setDisplayProfile(null);
        }
    }, [currentUser])

    const handleCreateProfile = async (name: string, description: string) => {
        if (!currentUser) {
            console.log("User not connected");
            return;
        }
        const tx = await createProfileTx(name, description);
        signAndExecute({
            transaction: tx
        }, {
            onSuccess: async (tx) => {
                await suiClient.waitForTransaction({
                    digest: tx.digest
                });
                fetchState();
            },
            onError: (error) => {
                console.log(error);
            }
        });
    }
    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto py-8 flex gap-4">
                <div className="flex flex-col gap-4 border-2 border-gray-200 p-4 rounded-md">
                    <div className="flex items-center justify-between bg-gray-200 p-4 rounded-md gap-4 font-bold">
                        <h1>Owner</h1>
                        <p>Profile</p>
                    </div>
                    {state?.users.map((user) => {
                        return <div key={user.owner} className="flex items-center justify-between bg-gray-100 p-4 rounded-md gap-4">
                            <h1>{user.owner}</h1>
                            <p>{user.profile}</p>
                        </div>
                    })}
                </div>
                {displayProfile ? <ProfileCard profile={displayProfile} /> : <CreateProfile onSubmit={handleCreateProfile} />}
            </main>
        </div>
    )
}

export default Main;
