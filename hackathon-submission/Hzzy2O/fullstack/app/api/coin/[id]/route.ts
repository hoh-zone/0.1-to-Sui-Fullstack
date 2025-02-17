import { NextResponse } from "next/server";
import { Coin, PrismaClient } from "@prisma/client";
import { getPoolData } from "@/utils/api";

const prisma = new PrismaClient();

export async function getCoinWithPrice(id: string) {
	const coin = await prisma.coin.findUnique({
		where: { id },
	});

	if (!coin) {
		return null;
	}

	const [poolData, suiPrice] = await Promise.all([
		getPoolData(coin.pool_id),
		getSuiPrice(),
	]);

	const tokenToSuiRate =
		Number(poolData.sui_reserve) / Number(poolData.token_reserve);
	const priceInUsd = tokenToSuiRate * suiPrice;
	const marketcap = (priceInUsd * Number(coin.initial_token_supply)) / 1e9;
	const liquidity = String(poolData.sui_reserve / 1e9 * suiPrice);

	return {
		...coin,
		price: priceInUsd,
		marketcap: marketcap,
		liquidity,
	} as Coin;
}

async function getSuiPrice() {
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

export async function PUT(
	_: Request,
	context: { params: { id: Promise<string> } },
) {
	try {
		await prisma.$connect();
		const id = await context.params.id;
		const coin = await getCoinWithPrice(id);

		await prisma.coin.update({
			where: { id },
			data: { ...coin },
		});

		return NextResponse.json(coin);
	} catch (error) {
		console.error("Update error:", error);
		return NextResponse.json(
			{ error: "failed to update coin" },
			{ status: 500 },
		);
	}
}

export async function GET(
	_: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const coin = await getCoinWithPrice(id);
		if (!coin) {
			return NextResponse.json({ error: "coin not found" }, { status: 404 });
		}

		return NextResponse.json({
			...coin,
		});
	} catch (error) {
		console.error("Error fetching token:", error);
		return NextResponse.json(
			{ error: "failed to get coin data" },
			{ status: 500 },
		);
	}
}
