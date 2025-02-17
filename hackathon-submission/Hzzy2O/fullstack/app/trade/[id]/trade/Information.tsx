"use client";
import { Coin } from "@prisma/client";
import { formatAddress } from "@mysten/sui/utils";
import { floor } from "lodash-es";

interface InformationProps {
	coinInfo: Coin;
}

export default function Information({ coinInfo }: InformationProps) {

	return (
		<div className="space-y-4 rounded-sm bg-indigo-900 py-2 px-4 w-full overflow-hidden text-xs">
			<div className="font-bold">INFORMATION</div>
			<div className="space-y-2 px-1">
				<div className="flex justify-between">
					<span className="text-neutral-400">POOL ID</span>
					<span className="text-xs">{formatAddress(coinInfo.pool_id)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-neutral-400">LIQUIDITY</span>
					<span>${floor(+coinInfo.liquidity, 4)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-neutral-400">CREATOR</span>
					<span>{formatAddress(coinInfo.creator)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-neutral-400">TOTAL SUPPLY</span>
					<span>
						{(Number(coinInfo.initial_token_supply) / 1e9).toLocaleString()}M
					</span>
				</div>
				<div className="flex justify-between">
					<span className="text-neutral-400">DESCRIPTION</span>
					<span className="max-w-1/2 text-right">{coinInfo.description}</span>
				</div>
			</div>
		</div>
	);
}
