'use client'

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {WalletContext} from "@/contexts/walletContext";
import {updateNFTInfo} from "@/libs/contracts";

export type NFTContextType = {
    nft: string | undefined,
    list: number,
    row: number,
    playing: boolean,
    award: number,
    historyData: (string[])[]
}

export const NFTContext = createContext<[NFTContextType, () => Promise<void>]>([{
    nft: undefined,
    list: 0,
    row: 0,
    playing: false,
    award: 0,
    historyData: []
}, async () => {}]);

export default function NFTContextProvider({children}: {children: ReactNode}) {
    const walletContext = useContext(WalletContext);
    const [info, setInfo] = useState<NFTContextType>({
        nft: undefined,
        list: 0,
        row: 0,
        playing: false,
        award: 0,
        historyData: []
    });
    const [oldAddress, setOldAddress] = useState<string>("");
    const queryAndStore = useCallback(async () => {
        setInfo(await updateNFTInfo(walletContext.walletAddress!, walletContext.walletAddress! === oldAddress ? info.nft : undefined));
        setOldAddress(walletContext.walletAddress!);
    }, [walletContext.walletAddress, info.nft, oldAddress]);
    useEffect(() => {
        if (!walletContext.walletAddress)
            return;
        queryAndStore().then();
    }, [walletContext.walletAddress, queryAndStore]);
    return (
        <NFTContext.Provider value={[info, queryAndStore]}>
            {children}
        </NFTContext.Provider>
    )
}