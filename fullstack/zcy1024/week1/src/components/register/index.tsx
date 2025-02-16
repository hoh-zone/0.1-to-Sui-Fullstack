'use client'

import {useState} from "react";
import {useCurrentAccount, useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {createProfileTx} from "@/lib/contracts";

export default function Register() {
    const [name, setName] = useState<string>("");
    const [desc, setDesc] = useState<string>("");
    const [registering, setRegistering] = useState<boolean>(false);
    const account = useCurrentAccount();
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const handleRegister = async () => {
        setRegistering(true);
        const tx = await createProfileTx(name, desc);
        signAndExecuteTransaction({
            transaction: tx
        }, {
            onSuccess: () => {
                window.location.reload();
            },
            onError: err => {
                console.log(err);
                setRegistering(false);
            }
        });
    }

    return (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col justify-between items-center gap-10 h-auto">
                <input className="w-64 px-1" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                <textarea className="w-64 min-h-32 max-h-64 px-1" placeholder="Description" onChange={(e) => setDesc(e.target.value)} />
                <button className={(!name || !desc || !account || registering ? "text-gray-500 " : "") + "transition-colors"} onClick={handleRegister} disabled={!name || !desc || !account || registering}>Register</button>
            </div>
        </div>
    )
}