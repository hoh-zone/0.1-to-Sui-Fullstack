"use client";

import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { SuiSignAndExecuteTransactionOutput } from "@mysten/wallet-standard";
import { useState } from "react";
import { suiClient } from "@/contracts";

export type BetterSignAndExecuteTransactionProps<
	TArgs extends unknown[] = unknown[],
> = {
	tx: (...args: TArgs) => Transaction;
	waitForTx?: boolean;
};

interface TransactionChain {
	beforeExecute: (callback: () => Promise<void>) => TransactionChain;
	onSuccess: (
		callback: (result: SuiSignAndExecuteTransactionOutput) => Promise<void>,
	) => TransactionChain;
	onError: (callback: (error: Error) => void) => TransactionChain;
	onSettled: (
		callback: (
			result: SuiSignAndExecuteTransactionOutput | undefined,
		) => void | Promise<void>,
	) => TransactionChain;
	execute: () => Promise<void>;
}

export function useBetterSignAndExecuteTransaction<
	TArgs extends unknown[] = unknown[],
>(props: BetterSignAndExecuteTransactionProps<TArgs>) {
	const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
	const [isLoading, setIsLoading] = useState(false);

	const handleSignAndExecuteTransaction = (
		...args: TArgs
	): TransactionChain => {
		const tx = props.tx(...args);
		let successCallback:
			| ((result: SuiSignAndExecuteTransactionOutput) => Promise<void>)
			| undefined;
		let errorCallback: ((error: Error) => void) | undefined;
		let settledCallback:
			| ((
					result: SuiSignAndExecuteTransactionOutput | undefined,
			  ) => void | Promise<void>)
			| undefined;
		let beforeExecuteCallback: (() => Promise<void>) | undefined;
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
			execute: async () => {
				try {
					if (isLoading) return;
					setIsLoading(true);
					await beforeExecuteCallback?.();
					await signAndExecuteTransaction(
						{ transaction: tx },
						{
							onSuccess: async (result) => {
								if (props.waitForTx !== false) {
									await suiClient.waitForTransaction({ digest: result.digest });
								}
								await successCallback?.(result);
							},
							onError: (error) => {
								errorCallback?.(error);
							},
							onSettled: async (result) => {
								await settledCallback?.(result);
								setIsLoading(false);
							},
						},
					);
				} catch (error) {
					errorCallback?.(error as Error);
					setIsLoading(false);
				}
			},
		};

		return chain;
	};

	return { handleSignAndExecuteTransaction, isLoading };
}
