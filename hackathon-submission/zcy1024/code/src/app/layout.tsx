import React from "react";
import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import {SuiProvider} from "@/providers";
import {NFTContextProvider, PoolContextProvider, TipContextProvider, WalletContextProvider} from "@/contexts";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "BlackSquid-Jumping",
    description: "BlackSquid-Jumping! Happy Game On Sui!",
    icons: "/logo.jpeg"
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <SuiProvider>
                    <WalletContextProvider>
                        <TipContextProvider>
                            <NFTContextProvider>
                                <PoolContextProvider>
                                    {children}
                                </PoolContextProvider>
                            </NFTContextProvider>
                        </TipContextProvider>
                    </WalletContextProvider>
                </SuiProvider>
            </body>
        </html>
    );
}
