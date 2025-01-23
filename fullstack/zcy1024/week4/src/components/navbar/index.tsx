'use client'

import {ConnectButton} from "@mysten/dapp-kit";

export default function Navbar() {
    return (
        <div className="flex justify-between items-center h-16 px-96">
            <span className="text-blue-600 text-2xl font-bold">
                HOH
            </span>
            <ConnectButton />
        </div>
    )
}