import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { networkConfig } from './utils/networkConfig'
import { Route, Routes, HashRouter as Router } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import LoginPage from './pages/LoginPage'

export function Main() {
  const queryClient = new QueryClient()

  return (
    <React.StrictMode>
      <Router>
        <ConfigProvider locale={zhCN}>
          <QueryClientProvider client={queryClient}>
            <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
              <WalletProvider autoConnect>
                <Routes>
                  {/* 登录 */}
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/home" element={<HomePage />} />
                </Routes>
              </WalletProvider>
            </SuiClientProvider>
          </QueryClientProvider>
        </ConfigProvider>
      </Router>
    </React.StrictMode>
  )
}
