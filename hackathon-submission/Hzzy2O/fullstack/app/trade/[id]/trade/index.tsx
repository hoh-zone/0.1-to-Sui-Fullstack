'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { TradeForm } from "./TradeForm";
import { Coin } from "@prisma/client";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import { createBuyTx, createSellTx } from "@/contracts/trade";
import {
	useSignAndExecuteTransaction,
	useCurrentAccount,
	useSuiClient,
} from "@mysten/dapp-kit";
import { calculateOutputAmount } from "@/utils/trade";
import { suiClient } from "@/contracts";
import Information from "./Information";
import { useToast } from "@/hooks/useToast";
import { useInterval } from "@/hooks/useInterval";

type Props = {
	coinInfo: Coin;
};

export default function Page({ coinInfo }: Props) {
	const account = useCurrentAccount();
	const [amount, setAmount] = useState("");
	const [type, setType] = useState<'buy' | 'sell'>("buy");
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [balance, setBalance] = useState({
		sui: 0,
		token: 0,
	});

	const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

	const [rate, setRate] = useState({
		suiToToken: 0,
		tokenToSui: 0,
	});
	const client = useSuiClient();
	const { toast } = useToast();

	const updateCoinData = async () => {
		try {
			const response = await fetch(`/api/coin/${coinInfo.id}`, {
				method: "PUT",
			});

			if (!response.ok) throw new Error("failed to update");
		} catch (error) {
			console.error("faield:", error);
		}
	};

	const fetchBalances = async () => {
		if (!account?.address) return;

		try {
			const suiBalance = await suiClient.getBalance({
				owner: account.address,
				coinType: SUI_TYPE_ARG,
			});

			const tokenBalance = await suiClient.getBalance({
				owner: account.address,
				coinType: coinInfo.ca,
			});

			setBalance({
				sui: Number(suiBalance.totalBalance) / 1e9,
				token: Number(tokenBalance.totalBalance) / 1e9,
			});
		} catch (error) {
			console.error("failed:", error);
		}
	};
	useEffect(() => {
		fetchBalances();
	}, [account]);
	const fetchData = async () => {
		setIsLoading(true);
		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			const virtualSuiReserve = BigInt(coinInfo.virtual_sui_reserve);
			const virtualTokenReserve = BigInt(coinInfo.virtual_token_reserve);

			const suiToToken =
				Number(virtualTokenReserve) / Number(virtualSuiReserve);
			const tokenToSui =
				Number(virtualSuiReserve) / Number(virtualTokenReserve);

			setRate({
				suiToToken,
				tokenToSui,
			});
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [coinInfo.symbol]);

	const fetchLatestCoinData = async () => {
		try {
			const response = await fetch(`/api/coin/${coinInfo.id}`);
			if (!response.ok) throw new Error("Failed to fetch");
			const data = await response.json();
			setRate({
				suiToToken:
					Number(data.virtual_token_reserve) / Number(data.virtual_sui_reserve),
				tokenToSui:
					Number(data.virtual_sui_reserve) / Number(data.virtual_token_reserve),
			});
		} catch (error) {
			console.error("failed:", error);
		}
	};

	useInterval(fetchLatestCoinData, 10000);

	const handleSubmit = async () => {
		if (!amount || isLoading) return;

		try {
			setIsLoading(true);
			const amountBigInt = BigInt(Math.floor(parseFloat(amount) * 1e9));
			let tx;

			if (type === "buy") {
				const minTokensOut = BigInt(
					Math.floor(
						parseFloat(calculateOutputAmount(amount, rate.suiToToken)) *
							0.99 *
							1e9,
					),
				);
				tx = createBuyTx(
					coinInfo.pool_id,
					coinInfo.ca,
					amountBigInt,
					minTokensOut,
				);
			} else {
				const minSuiOut = BigInt(
					Math.floor(
						parseFloat(calculateOutputAmount(amount, rate.tokenToSui)) *
							0.99 *
							1e9,
					),
				);
				tx = createSellTx(
					coinInfo.pool_id,
					coinInfo.ca,
					amountBigInt,
					minSuiOut,
					account!.address,
				);
			}

			const result = await signAndExecute({
				transaction: tx,
			});

			await client.waitForTransaction({
				digest: result.digest,
			});

			await updateCoinData();

			toast({
				description: `Trade has been successfully`,
			});

			await fetchLatestCoinData();
			fetchBalances();
		} catch (e) {
			toast({
				description: (e as Error).message || "error",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
			setAmount("");
		}
	};

	return (
		<div className="text-2xl w-[40%] px-14 font-retro">
			<h2>TRADE</h2>
			<div className="w-full pt-4">
				<div className="flex flex-col gap-8">
					<Tabs
						defaultValue="tab-1"
						onValueChange={(value) => {
							setType(value === "tab-1" ? "buy" : "sell");
							setAmount("");
						}}
					>
						<TabsList className="w-full h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1">
							<TabsTrigger
								value="tab-1"
								className="ts-green relative w-1/2 text-xl text-green-400 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-green-400"
							>
								BUY
							</TabsTrigger>
							<TabsTrigger
								value="tab-2"
								className="ts-red relative w-1/2 text-xl text-red-400 after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-red-400"
							>
								SELL
							</TabsTrigger>
						</TabsList>

						<TabsContent value="tab-1" className="space-y-4">
							<TradeForm
								type="buy"
								amount={amount}
								setAmount={setAmount}
								balance={balance}
								rate={rate}
								isLoading={isLoading}
								onSubmit={handleSubmit}
								coinInfo={coinInfo}
							/>
						</TabsContent>

						<TabsContent value="tab-2" className="space-y-4">
							<TradeForm
								type="sell"
								amount={amount}
								setAmount={setAmount}
								balance={balance}
								rate={rate}
								isLoading={isLoading}
								onSubmit={handleSubmit}
								coinInfo={coinInfo}
							/>
						</TabsContent>
					</Tabs>
					<div className="space-y-2">
						{/* <div className="text-sm mb-4">PROGRESS: 20%</div> */}
						{/* <Progress value={20} /> */}
					</div>
					<Information coinInfo={coinInfo} />
				</div>
			</div>
		</div>
	);
}
