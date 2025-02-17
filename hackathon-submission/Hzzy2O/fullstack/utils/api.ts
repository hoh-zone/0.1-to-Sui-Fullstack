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

export async function getSuiPrice() {
	try {
		const response = await fetch(
			"https://api.binance.com/api/v3/ticker/price?symbol=SUIUSDT",
		);
		const data = await response.json();
		return data.price;
	} catch (error) {
		console.error(error);
		return 0;
	}
}
