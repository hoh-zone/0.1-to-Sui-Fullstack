"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

import { Coin } from "@prisma/client";
import { useRouter } from "next/navigation";
import { format } from "timeago.js";
import { formatAddress, formatPrice } from "@/utils";
import { blo } from "blo";
import { floor } from "lodash-es";

const HeaderOpt = [
	"COIN",
	"PRICE",
	"MARKET CAP",
	"LIQUIDITY",
	"PROGRESS",
	"CREATED",
	"CREATOR",
];

function ListSkeleton() {
	return (
		<div className="w-full">
			<div className="w-full pt-6 px-18">
				<Table className="bg-blue-900 pb-8 rounded-md">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{HeaderOpt.map((opt) => (
								<TableHead key={opt}>{opt}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(10)].map((_, index) => (
							<TableRow key={index}>
								{HeaderOpt.map((_, secIndex) => (
									<TableCell key={`${index}-${secIndex}`}>
										<Skeleton className="h-10 w-full rounded-md" />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}

export default function Page() {
	const [coins, setCoins] = useState<Coin[]>([]);
	const [mounted, setMounted] = useState(false);

	const router = useRouter();

	useEffect(() => {
		fetch("/api/coin")
			.then((res) => res.json())
			.then((data) => {
				setCoins(data);
				setMounted(true);
			})
			.catch((err) => console.error("Error fetching coins:", err));
	}, []);

	if (!mounted) {
		return <ListSkeleton />;
	}

	return (
		<div className="w-full">
			<div className="w-full pt-6 px-18">
				<Table className="bg-blue-900 pb-8 rounded-md">
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							{HeaderOpt.map((opt) => (
								<TableHead key={opt}>{opt}</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{coins.map((coin) => (
							<TableRow
								key={coin.id}
								onClick={() => router.push(`/trade/${coin.id}`)}
								className="hover:bg-gray-800/50"
							>
								<TableCell>
									<div className="flex items-center gap-3">
										{coin.icon_url && (
											<Image
												src={coin.icon_url}
												alt={coin.name}
												width={40}
												height={40}
												className="rounded-md"
											/>
										)}
										<div className="flex flex-col">
											<span className="font-medium text-white">
												{coin.name}
											</span>
											<span className="text-sm text-gray-400">
												${coin.symbol}
											</span>
										</div>
									</div>
								</TableCell>
								<TableCell>
									${formatPrice((coin.price))}
								</TableCell>
								<TableCell>
									{floor(coin.marketcap, 4)}
								</TableCell>
								<TableCell>${floor(+coin.liquidity, 4)}</TableCell>
								<TableCell>
									{coin.marketcap?.toLocaleString()}
								</TableCell>
								<TableCell className="">{format(coin.createdAt)}</TableCell>
								<TableCell>
									<div className="flex items-center gap-3">
										<Image
											src={blo(coin.creator as `0x${string}`)}
											alt={coin.name}
											width={30}
											height={30}
											className="rounded-md"
										/>
										{formatAddress(coin.creator)}
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
