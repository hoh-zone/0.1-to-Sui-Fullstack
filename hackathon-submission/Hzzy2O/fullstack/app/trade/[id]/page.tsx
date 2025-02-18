"use client";
import { notFound } from "next/navigation";
import Detail from "./detail";
import Trade from "./trade";
import { use, useEffect, useState } from "react";
import { useInterval } from "@/hooks/useInterval";
import { Coin } from "@prisma/client";
import { suiClient } from "@/contracts";
import Loading from "./loading";

type PageProps = {
	params: Promise<{
		id: string;
	}>;
};

export default function Page({ params }: PageProps) {
	const { id } = use(params);
	const [coinInfo, setCoinInfo] = useState<Coin | null>(null);
	const [loading, setLoading] = useState(true);

	const fetchCoinData = async () => {
		try {
			const response = await fetch(`/api/coin/${id}`);
			if (!response.ok) throw new Error("Failed to fetch");
			const data = await response.json();
			setCoinInfo(data);
		} catch (error) {
			console.error("failed:", error);
		} finally {
			setLoading(false);
		}
	};

	useInterval(fetchCoinData, 10000);

	const getSwapEvents = async () => {
		const txDigest = "98syAv8xvqst9XjwJW9SG9bjopmAsrL9oRe4uAec6KWQ";
    const a = await suiClient.queryEvents({
			query: {
				MoveEventType:
					"0xe713053722a094c23d4f82480843e2c15fb9c6e40e4bf887b23758838957ba88::trade_coin::SwapEvent",
			},
			limit: 1000,
			order: "ascending",
		})

		const txBlock = await suiClient.getTransactionBlock({
			digest: txDigest,
			options: {
				showEvents: true,
				showEffects: true,
			},
		});

		const swapEvent = txBlock.events?.find((event) =>
			event.type.includes("::trade_coin::SwapEvent"),
		);

		console.log(txBlock, swapEvent);
	};
	useEffect(() => {
		fetchCoinData();
		getSwapEvents();
	}, [id]);

	if (loading) return <Loading />;
	if (!coinInfo) return notFound();

	return (
		<div className="text-2xl px-4 w-full overflow-y-auto pt-8 flex">
			<Detail coinInfo={coinInfo} />
			<Trade coinInfo={coinInfo} />
		</div>
	);
}
