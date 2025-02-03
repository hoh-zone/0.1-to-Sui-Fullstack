'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { networkConfig, network } from "@/contracts"
import "@mysten/dapp-kit/dist/index.css";
import { StateProvider } from "@/contexts/demo-state-provider";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={network}>
        <WalletProvider>
          <StateProvider>
            {children}
          </StateProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
