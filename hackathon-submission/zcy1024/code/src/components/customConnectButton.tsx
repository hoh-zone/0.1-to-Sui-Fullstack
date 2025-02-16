'use client'

import {useContext, useMemo} from "react";
import {WalletContext} from "@/contexts";
import {ConnectModal} from "@mysten/dapp-kit";

export default function CustomConnectButton() {
    const walletContext = useContext(WalletContext);
    const display = useMemo(() => {
        const splitName = (name: string | undefined) => {
            if (!name)
                return "Connect";
            return name.slice(0, 6) + "..." + name.slice(-4);
        }
        if (walletContext.suiName)
            return walletContext.suiName.length <= 13 ? walletContext.suiName : splitName(walletContext.suiName);
        if (walletContext.accountLabel)
            return walletContext.accountLabel.length <= 13 ? walletContext.accountLabel : splitName(walletContext.accountLabel);
        return splitName(walletContext.walletAddress);
    }, [walletContext]);

    return (
        <ConnectModal trigger={
            <div className="relative p-0.5 rounded-lg overflow-hidden">
                <div className="absolute top-1/2 left-1/2 w-2 h-16 bg-purple-400 origin-top-left opacity-60 animate-[spin_6s_linear_infinite]"></div>
                <div className="relative p-0.5 rounded-lg bg-[#222] text-[#A0A0A0]">
                    {
                        !walletContext.walletAddress
                            ?
                            <button>Connect</button>
                            :
                            <button className="relative" disabled={true}>{display}</button>
                    }
                </div>
            </div>
        }/>
    )
}