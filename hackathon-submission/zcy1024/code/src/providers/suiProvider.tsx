'use client'

import {ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {SuiClientProvider, WalletProvider} from "@mysten/dapp-kit";
import {networkConfig, network} from "@/configs/networkConfig";
import "@mysten/dapp-kit/dist/index.css";

const queryClient = new QueryClient();

export default function SuiProvider({children}: {children: ReactNode}) {
    return (
        <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork={network}>
                <WalletProvider autoConnect={true}>
                    {children}
                </WalletProvider>
            </SuiClientProvider>
        </QueryClientProvider>
    )
}