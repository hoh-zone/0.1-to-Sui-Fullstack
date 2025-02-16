// pages/_app.tsx
import { AppProps } from 'next/app';
import "@mysten/dapp-kit/dist/index.css";
import '@/index.css';

import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProfileProvider } from '../contexts/provider';
import { networkConfig } from '../networkConfig';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <ProfileProvider>
            {/* 这里会渲染相应的页面 */}
            <Component {...pageProps} />
          </ProfileProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
