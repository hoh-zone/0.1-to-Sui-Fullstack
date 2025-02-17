"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "./FileUpload";
import { coinAtom } from "@/store/createAtom";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { urlToFile } from "@/utils/blob";
import { deployTokenTx } from "@/contracts/deploy";
import {
	useCurrentAccount,
	useSignAndExecuteTransaction,
	useSuiClient,
} from "@mysten/dapp-kit";
import { createPoolTx } from "@/contracts/trade";
import { get } from "lodash-es";
import { useToast } from "@/hooks/useToast";
import type { CoinMetaData } from "@/types";
import { PoolInfo } from "@/types";
import { Coin } from "@prisma/client";
import { useRouter } from "next/navigation";

const getImageUrl = async (url: string): Promise<string> => {
	const file = await urlToFile(url);
	const formData = new FormData();
	formData.append("file", file);

	const response = await fetch("/api/upload", {
		method: "POST",
		body: formData,
	});

	if (!response.ok) {
		throw new Error("Failed to upload to Walrus");
	}

	const res = await response.json();

	return res.url;
};

function addCoin(data: Partial<Coin>) {
	return fetch("/api/coin", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
}

export default function CreateForm() {
	const router = useRouter();
	const form = useForm<CoinMetaData>({
		defaultValues: {
			name: "",
			symbol: "",
			description: "",
			icon_url: "",
		},
	});
	const [tokenInfo, setTokenInfo] = useAtom(coinAtom);
	const { toast } = useToast();
	const [submitting, setSubmitting] = useState(false);
	const [step, setStep] = useState<
		"idle" | "uploading" | "deploying" | "creating-pool"
	>("idle");

	const client = useSuiClient();
	const account = useCurrentAccount();
	const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();

	async function onSubmit(data: CoinMetaData) {
		if (submitting) return;
		setSubmitting(true);
		try {
			setStep("uploading");
			toast({
				description: "Uploading icon to Walrus...",
			});
			const url = await getImageUrl(data.icon_url);
			data.icon_url = url;

			setStep("deploying");
			toast({
				description: "Creating token on Sui...",
			});
			const tx = await deployTokenTx(account!.address, data);
			const res = await signAndExecute({
				transaction: tx,
			});
			const { objectChanges } = await client.waitForTransaction({
				digest: res.digest,
				options: {
					showObjectChanges: true,
				},
			});

			if (objectChanges) {
				let packageId, treasuryCap, metadata;

				objectChanges.forEach((obj) => {
					if (obj.type === "published") {
						packageId = obj.packageId;
					}
					if (obj.type === "created") {
						if (obj.objectType.includes("TreasuryCap"))
							treasuryCap = obj.objectId;
						if (obj.objectType.includes("CoinMetadata"))
							metadata = obj.objectId;
					}
				});

				if (packageId && treasuryCap && metadata) {
					setStep("creating-pool");
					toast({
						description: "Setting up liquidity pool...",
					});

					const ca = `${packageId}::${data.symbol.toLowerCase()}::${data.symbol.toUpperCase()}`;
					const poolTx = createPoolTx(treasuryCap, metadata, ca);

					const poolRes = await signAndExecute({
						transaction: poolTx,
					});

					const { events } = await client.waitForTransaction({
						digest: poolRes.digest,
						options: {
							showEvents: true,
						},
					});

					const poolInfo = get(events, "[0].parsedJson") as PoolInfo;

					const response = await addCoin({
						...data,
						...poolInfo,
						creator: account!.address,
						token_reserve: poolInfo.virtual_token_reserve,
						sui_reserve: "0",
						ca,
					});

					if (!response.ok) {
						throw new Error("Failed to save token information");
					}

					toast({
						variant: "default",
						title: "Success",
						description: "🎉 Congratulations! Your token is ready to trade!",
					});
					const createdCoin = await response.json();
					setTokenInfo(null);
					router.push(`/trade/${createdCoin.id}`);
				}
			}
		} catch (error) {
			toast({
				variant: "destructive",
				title: "Error",
				description:
					error instanceof Error ? error.message : "Something went wrong",
			});
			console.error(error);
			setSubmitting(false);
			setStep("idle");
		}
	}

	useEffect(() => {
		if (tokenInfo) {
			form.reset({
				name: tokenInfo.name,
				symbol: tokenInfo.symbol,
				description: tokenInfo.description,
				icon_url: tokenInfo.icon_url,
			});
		}
	}, [tokenInfo, form]);

	return (
		<div className="w-full max-w-md mx-auto px-8 font-retro">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					style={{ "--ring": "228 89% 74%" } as React.CSSProperties}
					className="space-y-5"
				>
					<FormField
						control={form.control}
						name="name"
						rules={{
							required: "name is required",
							minLength: {
								value: 2,
								message: "name must be at least 2 characters",
							},
						}}
						render={({ field }) => (
							<FormItem>
								<FormLabel>name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="symbol"
						rules={{
							required: "symbol is required",
						}}
						render={({ field }) => (
							<FormItem>
								<FormLabel>symbol</FormLabel>
								<FormControl>
									<div className="relative">
										<Input className="peer ps-8 border-4" {...field} />
										<div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
											<span className="text-white text-[15px]">$</span>
										</div>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="description"
						rules={{
							required: "description is required",
						}}
						render={({ field }) => (
							<FormItem>
								<FormLabel>desciption</FormLabel>
								<FormControl>
									<Textarea className="md:text-xs min-h-24" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="icon_url"
						rules={{
							required: "image is required",
						}}
						render={({ field: { ...field } }) => (
							<FormItem>
								<FormLabel>image</FormLabel>
								<FormControl>
									<FileUpload {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="w-full flex justify-center">
						<Button
							type="submit"
							disabled={submitting}
							className="w-full bg-blue-700 text-white hover:bg-blue-800 relative top-8 px-20 pixel-btn"
						>
							{submitting
								? step === "uploading"
									? "Uploading..."
									: step === "deploying"
										? "Deploying..."
										: step === "creating-pool"
											? "Creating Pool..."
											: "Processing..."
								: "Create"}
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
