'use client'

import {createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState} from "react";
import {useCurrentAccount} from "@mysten/dapp-kit";
import {
    queryCoins,
    queryDynamicFields,
    queryFolderContents,
    queryNFTs,
    queryProfile,
    queryState
} from "@/lib/contracts";
import {DynamicCoin, DynamicNFT, Profile} from "@/type";
import {CoinStruct, SuiObjectResponse} from "@mysten/sui/client";

export type ResourceType = {
    account: string | undefined,
    profile: string | undefined,
    profileContent: Profile | undefined,
    dynamicCoins: Map<string, DynamicCoin[]> | undefined,
    dynamicNFTs: Map<string, DynamicNFT[]> | undefined,
    coins: CoinStruct[],
    NFTs: SuiObjectResponse[]
} | undefined;

export const ResourceContext = createContext<[ResourceType, Dispatch<SetStateAction<boolean>>]>([undefined, () => {}]);

export function ResourceProvider({ children }: { children: ReactNode }) {
    const [contextValue, setContextValue] = useState<ResourceType>(undefined);
    const [refresh, setRefresh] = useState<boolean>(true);
    const account = useCurrentAccount();
    useEffect(() => {
        if (!account) {
            if (!contextValue || contextValue.account) {
                setContextValue({
                    account: undefined,
                    profile: undefined,
                    profileContent: undefined,
                    dynamicCoins: undefined,
                    dynamicNFTs: undefined,
                    coins: [],
                    NFTs: []
                });
            }
            return;
        }
        if (!refresh && account.address === contextValue?.account)
            return;
        setRefresh(false);
        const fetchData = async () => {
            const state = await queryState(null);
            const profile = state.users.find(user => user.owner === account.address)?.profile;
            const profileWithAddress = profile ? (await queryProfile(profile)) : undefined;
            const profileContent = profileWithAddress ? (await queryFolderContents(profileWithAddress)) : undefined;
            const [dynamicCoins, dynamicNFTs] = profileWithAddress ? (await queryDynamicFields(profileWithAddress.folders)) : [undefined, undefined];
            const coins = await queryCoins(account.address, null);
            const NFTs = await queryNFTs(account.address, null);
            setContextValue({
                account: account.address,
                profile,
                profileContent,
                dynamicCoins,
                dynamicNFTs,
                coins,
                NFTs,
            });
        };
        fetchData().then();
    }, [account, refresh, contextValue]);
    return <ResourceContext.Provider value={[contextValue, setRefresh]}>{children}</ResourceContext.Provider>;
}