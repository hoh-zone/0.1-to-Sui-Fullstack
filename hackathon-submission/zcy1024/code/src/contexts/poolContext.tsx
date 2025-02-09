'use client'

import {createContext, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {WalletContext} from "@/contexts/walletContext";
import {queryPoolInfo} from "@/libs/contracts";

export type PoolContextType = {
    total: number,
    invested_amount: number
}

export const PoolContext = createContext<[PoolContextType, () => Promise<void>]>([{
    total: 0,
    invested_amount: 0
}, async () => {}]);

export default function PoolContextProvider({children}: {children: ReactNode}) {
    const walletContext = useContext(WalletContext);
    const [poolInfo, setPoolInfo] = useState<PoolContextType>({
        total: 0,
        invested_amount: 0
    });
    const updatePoolInfo = useCallback(async () => {
        setPoolInfo(await queryPoolInfo(walletContext.walletAddress!));
    }, [walletContext.walletAddress]);
    useEffect(() => {
        if (!walletContext.walletAddress)
            return;
        updatePoolInfo().then();
    }, [walletContext.walletAddress, updatePoolInfo]);
    return (
        <PoolContext.Provider value={[poolInfo, updatePoolInfo]}>
            {children}
        </PoolContext.Provider>
    )
}