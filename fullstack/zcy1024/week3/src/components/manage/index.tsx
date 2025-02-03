'use client'

import {useContext, useEffect, useState} from "react";
import {ResourceContext} from "@/contexts";
import {addCoinToFolderTx, addNFTToFolderTx, createFolderTx} from "@/lib/contracts";
import {useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {suiClient} from "@/app/networkConfig";
import {Folder} from "@/type";
import {useBetterSignAndExecuteTransaction} from "@/hooks/useBetterTx";

export default function Manage() {
    const [resource, setRefresh] = useContext(ResourceContext);
    const [folders, setFolders] = useState<Folder[] | undefined>(undefined);
    const [currentFolderID, setCurrentFolderID] = useState<string | undefined>(undefined);
    useEffect(() => {
        const targetFolders = resource?.profileContent?.folders.toSorted((a, b) => a.name < b.name ? -1 : 1);
        setFolders(targetFolders);
        const targetValue = targetFolders && targetFolders.length > 0 ? targetFolders[0].id.id : "";
        (document.getElementById("select-folder") as HTMLSelectElement).value = targetValue;
        setCurrentFolderID(targetValue);
    }, [resource]);
    const [tab, setTab] = useState<string>("Coin");
    const [folderName, setFolderName] = useState<string>("");
    const [folderDescription, setFolderDescription] = useState<string>("");
    const [creatingFolder, setCreatingFolder] = useState<boolean>(false);
    const {mutate: signAndExecuteTransaction} = useSignAndExecuteTransaction({
        execute: async ({bytes, signature}) =>
            await suiClient.executeTransactionBlock({
                transactionBlock: bytes,
                signature,
                options: {
                    showRawEffects: true,
                    showEvents: true
                }
            })
    });
    const createFolder = async () => {
        if (!folderName || !folderDescription || creatingFolder || !resource?.profile)
            return;
        setCreatingFolder(true);
        const tx = await createFolderTx(folderName, folderDescription, resource.profile);
        signAndExecuteTransaction({
            transaction: tx,
        }, {
            onSuccess: async () => {
                const delay = async (ms: number) => {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }
                await delay(3000);
                // const folderId = (res.events![0].parsedJson as FolderCreated).id;
                // const folder = await queryExactFolder(folderId);
                setRefresh(true);
                // setFolders([
                //     ...folders!,
                //     folder
                // ].toSorted((a, b) => a.name < b.name ? -1 : 1));
                setFolderName("");
                setFolderDescription("");
            },
            onError: (err) => {
                console.log(err);
                setCreatingFolder(false);
            }
        })
    }
    const addCoinToFolder = async (coinID: string, coinType: string, coinBalance: string, index: number) => {
        if (currentFolderID === undefined)
            return;
        const inputBalance = (document.getElementById(`balanceInput${index}`)! as HTMLInputElement).value;
        if (Number(inputBalance) > Number(coinBalance))
            return;
        const tx = await addCoinToFolderTx(currentFolderID, coinID, coinType, Number(inputBalance));
        signAndExecuteTransaction({
            transaction: tx,
        }, {
            onSuccess: async () => {
                const delay = async (ms: number) => {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }
                await delay(3000);
                setRefresh(true);
                (document.getElementById(`balanceInput${index}`)! as HTMLInputElement).value = "0";
            },
            onError: (err) => {
                console.log(err);
            }
        })
    };
    const {handleSignAndExecuteTransaction: handleAddNFT} = useBetterSignAndExecuteTransaction({
        tx: addNFTToFolderTx,
        waitForTx: true
    });
    const addNFTToFolder = async (nftID: string, nftType: string) => {
        if (currentFolderID === undefined)
            return;
        await handleAddNFT({
            folderID: currentFolderID,
            nftID,
            nftType
        }).onSuccess(() => {
            setRefresh(true);
        }).onError((err) => {
            console.log(err);
        }).onExecute();
    };

    return (
        <div className="flex justify-between h-5/6 xl:px-20 2xl:px-52 mt-10">
            <div className="flex flex-col gap-6 h-full w-[58%] min-w-fit p-1 text-xs">
                <div className="w-fit border rounded-lg bg-[#EDEFEA] py-1 transition-all">
                    <span
                        className={"p-1 cursor-pointer border rounded-lg border-transparent " + (tab === "Coin" ? "bg-white" : "")}
                        onClick={() => setTab("Coin")}>Coin</span>
                    <span
                        className={"p-1 cursor-pointer border rounded-lg border-transparent " + (tab === "NFT" ? "bg-white" : "")}
                        onClick={() => setTab("NFT")}>NFT</span>
                </div>
                {
                    tab === "Coin"
                        ?
                        resource?.coins.map((coin, index) => {
                            return (
                                <div className="flex justify-between items-center" key={index}>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold">Object ID: {coin.coinObjectId}</span>
                                        <span>Type: {coin.coinType}</span>
                                        <span className="text-blue-400">Balance: {coin.balance}</span>
                                    </div>
                                    <div className="flex gap-1">
                                        <input className="border rounded-lg bg-transparent p-1 focus:outline-none"
                                               type="number"
                                               id={`balanceInput${index}`}
                                               defaultValue={0}/>
                                        <div
                                            className="border rounded-full bg-[#282725] px-3 py-1 text-[#D5D4D3] cursor-pointer"
                                            onClick={() => addCoinToFolder(coin.coinObjectId, coin.coinType, coin.balance, index)}>
                                            Add to Folder
                                        </div>
                                    </div>
                                </div>
                            )
                        }) :
                        resource?.NFTs.map((nft, index) => {
                            return (
                                <div className="flex justify-between items-center" key={index}>
                                    <div className="flex flex-col gap-1">
                                        <span className="font-bold">Object ID: {nft.data?.objectId}</span>
                                        <span>Type: {(nft.data?.content as unknown as { type: string }).type}</span>
                                    </div>
                                    <div
                                        className="border rounded-full bg-[#282725] px-3 py-1 text-[#D5D4D3] cursor-pointer"
                                        onClick={() => addNFTToFolder(nft.data!.objectId, (nft.data?.content as unknown as {
                                            type: string
                                        }).type)}>
                                        Add to Folder
                                    </div>
                                </div>
                            )
                        })
                }
            </div>
            <div className="h-full w-[41%] min-w-fit p-1">
                <div className="flex flex-col gap-5 items-center border border-gray-300 rounded-lg shadow p-1">
                    <div className="flex flex-col gap-1 w-96 text-center">
                        <div className="font-black text-2xl">Folder Manage</div>
                        <select className="focus:outline-none" id="select-folder"
                                onChange={(e) => setCurrentFolderID(e.target.value)}>
                            {
                                folders && folders.map((folder, index) => {
                                    return <option key={index} value={folder.id.id}>{folder.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="h-0 w-full border"></div>
                    <input className="w-96 focus:outline-none" placeholder="Folder Name" value={folderName}
                           onChange={(e) => setFolderName(e.target.value)}/>
                    <textarea className="w-96 max-h-20 focus:outline-none" placeholder="Folder Description"
                              value={folderDescription} onChange={(e) => setFolderDescription(e.target.value)}/>
                    <div
                        className="border rounded-full bg-[#282725] w-96 py-1 mb-5 text-[#D5D4D3] cursor-pointer text-center"
                        onClick={createFolder}>
                        Create New Folder
                    </div>
                </div>
                <div className="flex flex-col gap-3 text-sm mt-6">
                    <span className="font-bold">Folder Contents(Coins)</span>
                    <div className="flex flex-col gap-1 text-xs">
                        {
                            currentFolderID &&
                            resource?.dynamicCoins?.get(currentFolderID)?.toSorted((a, b) => Number(b.coinBalance) - Number(a.coinBalance)).map((coin, index) => {
                                return (
                                    <div className="flex flex-col gap-1" key={index}>
                                        <span className="font-bold">{coin.coinType}</span>
                                        <span className="text-gray-400">{coin.coinBalance}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <span className="font-bold">Folder Contents(NFTs)</span>
                    <div className="flex flex-col gap-1 text-xs">
                        {
                            currentFolderID &&
                            resource?.dynamicNFTs?.get(currentFolderID)?.toSorted((a, b) => a.NFTID < b.NFTID ? -1 : 1).map((nft, index) => {
                                return (
                                    <div className="flex flex-col gap-1" key={index}>
                                        <span className="font-bold">{nft.NFTType}</span>
                                        <span className="text-gray-400">{nft.NFTID}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}