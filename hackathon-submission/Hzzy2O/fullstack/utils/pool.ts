import { client } from "@/app/api/_constant";

export async function getPoolData(poolId: string) {
	try {
		const poolData = await client.getObject({
			id: poolId,
			options: { showContent: true },
		});

		if (
			!poolData.data?.content ||
			poolData.data?.content?.dataType !== "moveObject"
		) {
			throw new Error("Pool not found");
		}
		const { fields } = poolData.data.content;
		return {
			virtual_sui_reserve: fields.virtual_sui_reserve,
			virtual_token_reserve: fields.virtual_token_reserve,
			sui_reserve: fields.sui_reserve,
			token_reserve: fields.token_reserve,
		};
	} catch (error) {
		console.error("获取池子数据失败:", error);
		throw error;
	}
}

export async function getSwapEvents(tx: string) {
	try {
    console.log(tx)
		const events = await client.queryEvents({
			query: {
				MoveEventType:
					"0xe713053722a094c23d4f82480843e2c15fb9c6e40e4bf887b23758838957ba88::trade_coin::SwapEvent",
				Transaction: tx,
			},
			limit: 1000,
			order: "ascending",
		});

		const priceMap = new Map<
			string,
			{
				open: number;
				high: number;
				low: number;
				close: number;
				volume: number;
				timestamp: Date;
			}
		>();

		for (const event of events.data) {
			const eventData = event.parsedJson as {
				is_buy: boolean;
				input_amount: string;
				output_amount: string;
				sui_reserve: string;
				token_reserve: string;
			};

			const timestamp = new Date(Number(event.timestampMs));
			const timeKey = new Date(
				Math.floor(timestamp.getTime() / (5 * 60000)) * (5 * 60000),
			).toISOString();

			const price = eventData.is_buy
				? Number(eventData.input_amount) / Number(eventData.output_amount)
				: Number(eventData.output_amount) / Number(eventData.input_amount);

			if (!priceMap.has(timeKey)) {
				priceMap.set(timeKey, {
					open: price,
					high: price,
					low: price,
					close: price,
					volume: Number(eventData.input_amount),
					timestamp: new Date(timeKey),
				});
			} else {
				const candle = priceMap.get(timeKey)!;
				candle.high = Math.max(candle.high, price);
				candle.low = Math.min(candle.low, price);
				candle.close = price;
				candle.volume += Number(eventData.input_amount);
			}
		}

		return Array.from(priceMap.values());
	} catch (error) {
		console.error("Error fetching swap events:", error);
		return [];
	}
}

export async function getSuiPrice() {
	try {
		const response = await fetch(
			"https://api.coingecko.com/api/v3/simple/price?ids=sui&vs_currencies=usd",
		);
		const data = await response.json();
		return data.sui.usd;
	} catch (error) {
		console.error("获取 SUI 价格失败:", error);
		return 0;
	}
}
