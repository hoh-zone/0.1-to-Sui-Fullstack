'use client'

import {useEffect, useState} from "react";
import {Navbar, Register, Resource} from "@/components"
import {useCurrentAccount} from "@mysten/dapp-kit";
import {queryState} from "@/lib/contracts";

export default function Home() {
    const account = useCurrentAccount();
    const [hasProfile, setHasProfile] = useState<boolean>(false);
    useEffect(() => {
        if (!account)
            return;
        const fetchProfile = async () => {
            const state = await queryState(null);
            setHasProfile(state.users.find(user => user.owner === account.address) !== undefined)
        };
        fetchProfile().then();
    }, [account]);

    return (
        <div className="w-screen h-screen bg-[#f5f2f1] text-black">
            <Navbar />
            {!hasProfile ? <Register /> : <Resource />}
        </div>
    );
}