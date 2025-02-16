'use client'

import {Transaction} from "@mysten/sui/transactions";
import {useSignAndExecuteTransaction} from "@mysten/dapp-kit";
import {SuiSignAndExecuteTransactionOutput} from "@mysten/wallet-standard";
import {useState} from "react";
import {suiClient} from "@/app/networkConfig";

export type BetterSignAndExecuteTransactionProps<TArgs extends unknown[] = unknown[]> = {
    tx: (...args: TArgs) => Transaction,
    waitForTx?: boolean
}

type TransactionChain = {
    beforeExecute: (callback: () => Promise<void>) => TransactionChain,
    onSuccess: (callback: (result: SuiSignAndExecuteTransactionOutput | undefined) => Promise<void> | void) => TransactionChain,
    onError: (callback: (error: Error) => void) => TransactionChain,
    onSettled: (callback: (result: SuiSignAndExecuteTransactionOutput | undefined) => Promise<void> | void) => TransactionChain,
    onExecute: () => Promise<void>
}

export function useBetterSignAndExecuteTransaction<TArgs extends unknown[] = unknown[]>(props: BetterSignAndExecuteTransactionProps<TArgs>) {
    const {mutate: signAndExecuteTransaction} = useSignAndExecuteTransaction();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSignAndExecuteTransaction = (...args: TArgs): TransactionChain => {
        const tx = props.tx(...args);
        let beforeExecuteCallback: (() => Promise<void>) | undefined;
        let successCallback: ((result: SuiSignAndExecuteTransactionOutput | undefined) => Promise<void> | void) | undefined;
        let errorCallback: ((error: Error) => void) | undefined;
        let settledCallback: ((result: SuiSignAndExecuteTransactionOutput | undefined) => Promise<void> | void) | undefined;
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
                        onError: (error) => {
                            errorCallback?.(error);
                        },
                        onSettled: async (result) => {
                            await settledCallback?.(result);
                            setIsLoading(false);
                        }
                    })
                } catch (err) {
                    errorCallback?.(err as Error);
                    setIsLoading(false);
                }
            }
        }
        return chain;
    }
    return {
        handleSignAndExecuteTransaction,
        isLoading
    }
}