'use client'

import {createContext, ReactNode, useMemo} from "react";
import {useAccounts, useCurrentAccount, useResolveSuiNSName} from "@mysten/dapp-kit";
import type { WalletAccount } from '@mysten/wallet-standard';

type WalletContextType = {
    suiName: string | null | undefined,
    accountLabel: string | undefined,
    walletAddress: string | undefined,
    accounts: readonly WalletAccount[]
}

export const WalletContext = createContext<WalletContextType>({
    suiName: undefined,
    accountLabel: undefined,
    walletAddress: undefined,
    accounts: []
});

export default function WalletContextProvider({children}: { children: ReactNode }) {
    const account = useCurrentAccount();
    const walletAddress = useMemo(() => account?.address, [account]);
    const {data: suiName} = useResolveSuiNSName(walletAddress);
    const accounts = useAccounts();
    return (
        <WalletContext.Provider value={{
            suiName,
            accountLabel: account?.label,
            walletAddress,
            accounts
        }}>
            {children}
        </WalletContext.Provider>
    )
}