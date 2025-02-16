import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Theme} from "@radix-ui/themes";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import {SuiClientProvider, WalletProvider} from "@mysten/dapp-kit";
import {networkConfig} from "@/networkConfig.ts";

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Theme appearance="light">
            <QueryClientProvider client={queryClient}>
                <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
                    <WalletProvider autoConnect>
                        <App/>
                    </WalletProvider>
                </SuiClientProvider>
            </QueryClientProvider>
        </Theme>
    </StrictMode>,
)
