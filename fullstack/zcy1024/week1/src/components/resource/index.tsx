'use client'

import {useEffect, useState} from "react";
import {suiClient} from "@/app/networkConfig";
import {useCurrentAccount} from "@mysten/dapp-kit";
import {CoinStruct} from "@mysten/sui/client";

export default function Resource() {
    const account = useCurrentAccount();
    const [coins, setCoins] = useState<CoinStruct[]>([]);
    useEffect(() => {
        if (!account)
            return;
        const fetchCoins = async () => {
            return await suiClient.getCoins({
                owner: account.address
            });
        }
        fetchCoins().then(coins => {
            setCoins(coins.data.length <= 10 ? coins.data : coins.data.slice(0, 10));
        })
    }, [account]);

    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <p className="text-xl font-bold mb-2">
                some or all your coins:
            </p>
            <ul className="list-disc list-inside">
                {coins.map((coin, index) => <li key={index}>{`${coin.coinType}: ${coin.balance}`}</li>)}
            </ul>
        </div>
    )
}