'use client'

import {useContext, useEffect, useState} from "react";
import {Player} from "@/components/index";
import {useBetterSignAndExecuteTransaction} from "@/hooks";
import {
    delay,
    endGameTx,
    handleEvent,
    handleHistoryData,
    nextPosition2Tx,
    nextPositionTx,
    startGameTx
} from "@/libs/contracts";
import {NFTContext, PoolContext, TipContext, WalletContext} from "@/contexts";

export default function PlayArea() {
    const [gaming, setGaming] = useState<boolean>(false);
    const [platforms, setPlatforms] = useState<void[]>([]);
    const [playerIdx, setPlayerIdx] = useState<[number, number]>([0, 0]);
    const walletContext = useContext(WalletContext);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [tips, setTips] = useContext(TipContext);
    const [info, updateInfo] = useContext(NFTContext);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [poolInfo, updatePoolInfo] = useContext(PoolContext);

    useEffect(() => {
        setPlayerIdx([info.list, info.row]);
        setGaming(info.playing);
    }, [info.list, info.row, info.playing]);

    const {handleSignAndExecuteTransaction: handleStartGame} = useBetterSignAndExecuteTransaction({
        tx: startGameTx,
        waitForTx: true
    });
    const handleStart = async () => {
        await handleStartGame({
            nft: info.nft,
            account: walletContext.walletAddress!
        }).beforeExecute(() => {
            setTips("Waiting...")
        }).onSuccess(async () => {
            await updateInfo();
            await updatePoolInfo();
            setTips("");
        }).onError((err) => {
            console.log(err);
            setTips("");
        }).onExecute();
    }
    const {handleSignAndExecuteTransaction: handleEndGame} = useBetterSignAndExecuteTransaction({
        tx: endGameTx,
        waitForTx: true
    });
    const handleEnd = async () => {
        await handleEndGame({
            nft: info.nft!
        }).beforeExecute(() => {
            setTips("Waiting...")
        }).onSuccess(async (res) => {
            await updateInfo();
            await updatePoolInfo();
            const tips = handleEvent(res?.events?.[0]);
            if (tips) {
                setTips(tips);
                await delay(3000);
            }
            setTips("");
        }).onError((err) => {
            console.log(err);
            setTips("");
        }).onExecute();
    }
    const handleStartOrOver = () => {
        if (!walletContext.walletAddress)
            return;
        if (!gaming) {
            handleStart().then();
        } else {
            handleEnd().then();
        }
    }

    useEffect(() => {
        const PlatformNums = 6;
        const delay = async (ms: number) => {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        const addPlatforms = async () => {
            for (let i = 0; i < PlatformNums; i++) {
                setPlatforms(Array.from<void>({length: i + 1}));
                await delay(200);
            }
        }
        addPlatforms().then();
    }, []);

    const {handleSignAndExecuteTransaction: handleNextPosition} = useBetterSignAndExecuteTransaction({
        tx: nextPositionTx,
        waitForTx: true
    });
    const {handleSignAndExecuteTransaction: handleNextPosition2} = useBetterSignAndExecuteTransaction({
        tx: nextPosition2Tx,
        waitForTx: true
    });
    const handleClick = async (list: number, row: number) => {
        setTips("Waiting...");
        const [down, up] = await handleHistoryData(info.historyData);
        if (down === -1) {
            await handleNextPosition({
                list: list + 1,
                row: row,
                nft: info.nft!
            }).onSuccess(async (res) => {
                await updateInfo();
                await updatePoolInfo();
                const tips = handleEvent(res?.events?.[0]);
                if (tips) {
                    setTips(tips);
                    await delay(3000);
                }
                setTips("");
            }).onError((err) => {
                console.log(err);
                setTips("");
            }).onExecute();
        } else {
            await handleNextPosition2({
                list: list + 1,
                row: row,
                down,
                up,
                nft: info.nft!
            }).onSuccess(async (res) => {
                await updateInfo();
                await updatePoolInfo();
                const tips = handleEvent(res?.events?.[0]);
                if (tips) {
                    setTips(tips);
                    await delay(3000);
                }
                setTips("");
            }).onError((err) => {
                console.log(err);
                setTips("");
            }).onExecute();
        }
    }

    return (
        <div className="flex flex-col justify-between items-center h-full p-28 opacity-60">
            <div className="relative top-[6%] flex items-center gap-10 animate-[easyIn_12s_ease-in-out_forwards] -skew-x-6">
                <div
                    className={"relative h-[126px] w-[126px] bg-[#1A1A1A] rounded-full border-double border-2 animate-borderColor transition-all duration-1000 " + (playerIdx[0] === 0 ? "" : "bg-black")}>
                    <Player areaIndex={[0, 0]} playerIndex={playerIdx}/>
                </div>
                {
                    platforms.map((_, index) =>
                        <div key={index} className="flex flex-col gap-10 animate-[easyIn_6s_ease-in-out_forwards]">
                            {
                                Array.from<void>({length: 3}).map((_, innerIndex) =>
                                    <button key={innerIndex}
                                            className={"relative h-[126px] w-[126px] rounded-full border-double border-2 animate-borderColor transition-all duration-1000 " + (playerIdx[0] === index || playerIdx[0] - 1 === index && playerIdx[1] === innerIndex ? "bg-[#1A1A1A]" : "bg-black")}
                                            disabled={playerIdx[0] !== index || !gaming}
                                            onClick={() => handleClick(index, innerIndex)}>
                                        <Player areaIndex={[index + 1, innerIndex]} playerIndex={playerIdx}/>
                                    </button>)
                            }
                        </div>
                    )
                }
            </div>
            <div className="flex gap-36 items-center">
                <div>{!gaming ? "Ticket: 1Sui" : `Award: ${info.award}Sui`}</div>
                <div
                    className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 cursor-pointer p-1 rounded-full animate-pulse"
                    onClick={handleStartOrOver}>
                    {!gaming ? "Start Game" : "End Game"}
                </div>
            </div>
        </div>
    )
}