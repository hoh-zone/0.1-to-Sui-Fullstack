import { processObject } from "@/lib";
import { queryCoinMetadata, queryFolders, queryObjects, queryProfile, queryState } from "@/lib/contracts";
import { DisplayProfile } from "@/type";
import { useCurrentAccount } from "@mysten/dapp-kit";
import React from "react";
import { createContext, useCallback, useEffect, useState } from "react";

interface ProfileContext{
    profile: DisplayProfile | null,
    refresh: () => Promise<void>,
}

const ProfileContext = createContext<ProfileContext | undefined>(undefined);

export const ProfileProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [displayProfile, setDisplayProfile] = useState<DisplayProfile | null>(null);
    const currentUser = useCurrentAccount();
    const fetchData = useCallback(async () => {
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
        };
    }, [currentUser]);
    
    useEffect(() => {
        fetchData();
    }, [currentUser]);
    
    
    return (
        <ProfileContext.Provider value={{profile: displayProfile, refresh: fetchData}}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile(){
    const context = React.useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfileContext must be used within a ProfileProvider');
    }
    return context;
}