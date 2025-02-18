"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { darkTheme } from "./theme";
import { networkConfig, network } from "@/contracts";
import Layout from "@/components/layout";
import "@mysten/dapp-kit/dist/index.css";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem
			disableTransitionOnChange
		>
			<QueryClientProvider client={queryClient}>
				<SuiClientProvider networks={networkConfig} defaultNetwork={network}>
					<WalletProvider theme={darkTheme} autoConnect={true}>
						<Layout>{children}</Layout>
					</WalletProvider>
				</SuiClientProvider>
			</QueryClientProvider>
		</NextThemesProvider>
	);
}
