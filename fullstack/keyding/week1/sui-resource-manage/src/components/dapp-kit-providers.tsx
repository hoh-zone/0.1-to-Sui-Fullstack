'use client'

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@mysten/dapp-kit/dist/index.css'
import { networkConfig } from '@/lib/contracts/network-config'

interface DappKitProvidersProps {
  children: React.ReactNode
}

const queryClient = new QueryClient()

export default function DappKitProviders({ children }: DappKitProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider
        networks={networkConfig}
        defaultNetwork='testnet'
      >
        <WalletProvider>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  )
}
