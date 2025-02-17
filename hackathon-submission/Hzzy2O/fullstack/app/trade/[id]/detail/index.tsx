"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import TradingView from "./Charts";
import { RetroButton } from "@/components/ui/button";
import { useToast } from "@/hooks/useToast";
import { formatAddress } from "@mysten/sui/utils";
import { Coin } from "@prisma/client";
import { useEffect, useState } from "react";
import { useInterval } from "@/hooks/useInterval";
import { floor } from "lodash-es";
import { format } from "timeago.js";
import { formatPrice } from "@/utils";

type Props = {
	coinInfo: Coin;
};

export default function Page({ coinInfo }: Props) {
	const { toast } = useToast();

	function handleCopy() {
		navigator.clipboard.writeText(coinInfo.ca);
		toast({
			description: "Copyed to clipboard!",
		});
	}

	return (
		<div className="rounded-md font-retro my-8 relative bg-blue-700 mx-12 p-10 w-[60%] rgb-text">
			<div className="scanlines"></div>
			<div className="relative z-10">
				<div className="flex mb-4 w-full gap-4">
					<Avatar className="h-20 w-20">
						<AvatarImage src={coinInfo.icon_url} alt="Profile image" />
					</Avatar>
					<div className="w-full pr-4 flex justify-between text-center gap-4">
						<div className="flex flex-col px-2 overflow-hidden gap-1">
							<p className="flex items-end font-bold text-xl text-neutral-50">
								{coinInfo.name}
							</p>
							<p className="text-sm text-neutral-100 text-left">
								${coinInfo.symbol}
							</p>
							<p className="text-sm flex items-center gap-4 text-neutral-200 text-left">
								{formatAddress(coinInfo.ca)}
								<RetroButton size="xs" onClick={handleCopy}>
									COPY CA
								</RetroButton>
							</p>
						</div>
						<div className="flex gap-6 text-white items-center">
							<p className="text-xs flex text-neutral-300 flex-col gap-2">
								PRICE
								<span className="text-base text-white">
									${formatPrice(coinInfo.price)}
								</span>
							</p>
							<p className="text-xs flex text-neutral-300 flex-col gap-2">
								MARKET CAP
								<span className="text-base text-white">
									${floor(coinInfo.marketcap, 4)}
								</span>
							</p>
							<p className="text-xs flex text-neutral-300 flex-col gap-2">
								CREATED AT
								<span className="text-sm text-white">
									{format(coinInfo.createdAt)}
								</span>
							</p>
						</div>
					</div>
				</div>
				<TradingView coinId={coinInfo.pool_id}/>
			</div>
		</div>
	);
}
