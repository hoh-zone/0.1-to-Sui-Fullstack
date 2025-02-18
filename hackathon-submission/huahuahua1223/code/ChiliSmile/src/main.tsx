import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SuiClientProvider, WalletProvider, ThemeVars } from '@mysten/dapp-kit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { networkConfig } from "./config/networkConfig";
// 导入 dapp-kit 样式
import '@mysten/dapp-kit/dist/index.css'

// 创建查询客户端
const queryClient = new QueryClient()

// 自定义暗色主题
const darkTheme: ThemeVars = {
  blurs: {
    modalOverlay: 'blur(8px)',
  },
  backgroundColors: {
    primaryButton: 'transparent',
    primaryButtonHover: 'rgba(255, 255, 255, 0.1)',
    outlineButtonHover: 'rgba(255, 255, 255, 0.1)',
    modalOverlay: 'rgba(0, 0, 0, 0.8)',
    modalPrimary: '#001529',
    modalSecondary: '#002140',
    iconButton: 'transparent',
    iconButtonHover: 'rgba(255, 255, 255, 0.1)',
    dropdownMenu: '#001529',
    dropdownMenuSeparator: '#002140',
    walletItemSelected: '#002140',
    walletItemHover: 'rgba(255, 255, 255, 0.1)',
  },
  borderColors: {
    outlineButton: 'rgba(255, 255, 255, 0.15)',
  },
  colors: {
    primaryButton: '#ffffff',
    outlineButton: '#ffffff',
    iconButton: '#ffffff',
    body: '#ffffff',
    bodyMuted: 'rgba(255, 255, 255, 0.65)',
    bodyDanger: '#ff4d4f',
  },
  radii: {
    small: '4px',
    medium: '6px',
    large: '8px',
    xlarge: '12px',
  },
  shadows: {
    primaryButton: '0 2px 0 rgba(0, 0, 0, 0.045)',
    walletItemSelected: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    bold: '600',
  },
  fontSizes: {
    small: '14px',
    medium: '16px',
    large: '18px',
    xlarge: '20px',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    fontStyle: 'normal',
    lineHeight: '1.5715',
    letterSpacing: '0.2px',
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider
          autoConnect
          preferredWallets={['sui-wallet', 'ethos', 'suiet']}
          theme={darkTheme}
        >
          <App />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>,
)
