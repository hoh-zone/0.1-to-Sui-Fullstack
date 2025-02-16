'use client'

import {ChangeEvent, Dispatch, SetStateAction, useCallback, useContext, useState} from "react";
import {useBetterSignAndExecuteTransaction} from "@/hooks";
import {delay, investTx} from "@/libs/contracts";
import {PoolContext, TipContext} from "@/contexts";

export default function Invest({closeInvestAction}: { closeInvestAction: Dispatch<SetStateAction<boolean>> }) {
    const [balance, setBalance] = useState<string>("");
    const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const target = e.target.value;
        const arr = Array.from(target);
        if (arr.find(num => num < '0' || num > '9'))
            return;
        const idx = arr.findIndex(num => num > '0');
        setBalance(idx === -1 ? "" : target.slice(idx));
    }
    const [closing, setClosing] = useState<boolean>(false);
    const close = useCallback(async () => {
        setClosing(true);
        await delay(1000);
        closeInvestAction(false);
    }, [closeInvestAction]);

    const [tips, setTips] = useContext(TipContext);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, updatePoolInfo] = useContext(PoolContext);
    const {handleSignAndExecuteTransaction: handleInvest} = useBetterSignAndExecuteTransaction({
        tx: investTx,
        waitForTx: true
    });
    const handleClick = async () => {
        await handleInvest({
            amount: Number(balance)
        }).beforeExecute(() => {
            setTips("Waiting...");
        }).onSuccess(async () => {
            await updatePoolInfo();
            await close();
            setTips("");
        }).onError((err) => {
            console.log(err);
            setTips("");
        }).onExecute();
    }
    return (
        <div className={"absolute top-0 left-0 w-full h-full opacity-60 overflow-hidden " + (tips ? "" : "z-50")}>
            <div className={"w-full h-full bg-black " + (closing ? "animate-[easyOut_1s_ease-in-out_forwards]" : "animate-[easyIn_1s_ease-in-out_forwards]")} onClick={close}></div>
            <div className={"absolute -translate-x-1/2 -translate-y-1/2 " + (closing ? "animate-investOut" : "animate-investIn")}>
                <div className="flex flex-col gap-10">
                    <input
                        className="rounded-full p-1 focus:outline-none text-black"
                        placeholder="Balance Number"
                        value={balance}
                        onChange={inputChange}/>
                    <button className={balance && "hover:scale-110 active:scale-90 transition-all"}
                            disabled={!balance}
                            onClick={handleClick}>Invest
                    </button>
                </div>
            </div>
        </div>
    )
}