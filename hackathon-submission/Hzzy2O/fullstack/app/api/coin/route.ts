import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSuiPrice } from "@/utils/api";

const prisma = new PrismaClient();

export async function GET() {
	try {
		await prisma.$connect();
		const coins = await prisma.coin.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json(coins);
	} catch (_) {
		return NextResponse.json({ error: "获取代币列表失败" }, { status: 500 });
	}
}

export async function POST(request: Request) {
	try {
		await prisma.$connect();
		const body = await request.json();
		const price = await getSuiPrice();
		const coin = await prisma.coin.create({
			data: {
				name: body.name,
				symbol: body.symbol,
				description: body.description,
				icon_url: body.icon_url,
				ca: body.ca,
				pool_id: body.pool_id,
				token_type: body.token_type,
				initial_token_supply: body.initial_token_supply,
				max_sui_cap: body.max_sui_cap,
				virtual_sui_reserve: body.virtual_sui_reserve,
				virtual_token_reserve: body.virtual_token_reserve,
				creator: body.creator,
				sui_reserve: body.sui_reserve,
				token_reserve: body.token_reserve,
				liquidity: String(Number(body.sui_reserve) * price),
				price: 0,
				marketcap: 0,
			},
		});

		return NextResponse.json(coin);
	} catch (_) {
		return NextResponse.json({ error: "创建代币失败" }, { status: 500 });
	}
}
