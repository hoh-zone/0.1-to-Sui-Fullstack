'use client'

import {Transaction} from "@mysten/sui/transactions";
import {useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {SuiSignAndExecuteTransactionBlockOutput} from "@mysten/wallet-standard";
import {useState} from "react";
import {suiClient} from "@/configs/networkConfig";

export type BetterSignAndExecuteTransactionProps<TArgs extends unknown[] = unknown[]> = {
    tx: (...args: TArgs) => Transaction,
    waitForTx?: boolean
}

type TransactionChain = {
    beforeExecute: (callback: () => Promise<void> | void) => TransactionChain,
    onSuccess: (callback: (result: SuiSignAndExecuteTransactionBlockOutput | undefined) => Promise<void> | void) => TransactionChain,
    onError: (callback: (error: Error) => Promise<void> | void) => TransactionChain,
    onSettled: (callback: (result: SuiSignAndExecuteTransactionBlockOutput | undefined) => Promise<void> | void) => TransactionChain,
    onExecute: () => Promise<void>
}

export function useBetterSignAndExecuteTransaction<TArgs extends unknown[] = unknown[]>(props: BetterSignAndExecuteTransactionProps<TArgs>) {
    const {mutate: signAndExecuteTransaction} = useSignAndExecuteTransaction({
        execute: async ({ bytes, signature }) => {
            return await suiClient.executeTransactionBlock({
                transactionBlock: bytes,
                signature,
                options: {
                    showRawEffects: true,
                    showEvents: true
                }
            })
        }
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSignAndExecuteTransaction = (...args: TArgs) => {
        const tx = props.tx(...args);
        let beforeExecuteCallback: (() => Promise<void> | void) | undefined;
        let successCallback: ((result: SuiSignAndExecuteTransactionBlockOutput | undefined) => Promise<void> | void) | undefined;
        let errorCallback: ((error: Error) => Promise<void> | void) | undefined;
        let settledCallback: ((result: SuiSignAndExecuteTransactionBlockOutput | undefined) => Promise<void> | void) | undefined;
        const chain: TransactionChain = {
            beforeExecute: (callback) => {
                beforeExecuteCallback = callback;
                return chain;
            },
            onSuccess: (callback) => {
                successCallback = callback;
                return chain;
            },
            onError: (callback) => {
                errorCallback = callback;
                return chain;
            },
            onSettled: (callback) => {
                settledCallback = callback;
                return chain;
            },
            onExecute: async () => {
                try {
                    if (isLoading)
                        return;
                    setIsLoading(true);
                    await beforeExecuteCallback?.();
                    signAndExecuteTransaction({
                        transaction: tx
                    }, {
                        onSuccess: async (result) => {
                            if (props.waitForTx) {
                                await suiClient.waitForTransaction({
                                    digest: result.digest
                                });
                            }
                            await successCallback?.(result);
                        },
                        onError: async (err) => {
                            await errorCallback?.(err);
                        },
                        onSettled: async (result) => {
                            await settledCallback?.(result);
                            setIsLoading(false);
                        }
                    });
                } catch (err) {
                    await errorCallback?.(err as Error);
                    setIsLoading(false);
                }
            }
        };
        return chain;
    }
    return {
        handleSignAndExecuteTransaction,
        isLoading
    }
}