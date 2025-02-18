import { formatNumber, calculateOutputAmount } from "@/utils/trade";
import { Coin } from "@prisma/client";
import { floor } from "lodash-es";

interface TradeFormProps {
	type: any;
	amount: string;
	setAmount: (amount: string) => void;
	balance: any;
	rate: any;
	isLoading: boolean;
	onSubmit: () => void;
	coinInfo: Coin;
}

export function TradeForm({
	type,
	amount,
	setAmount,
	balance,
	rate,
	isLoading,
	onSubmit,
	coinInfo,
}: TradeFormProps) {
	const isBuy = type === "buy";
	const percentages = isBuy ? [0.01, 0.1, 0.5, 1] : [0.25, 0.5, 0.75, 1];
	const currentBalance = isBuy ? balance.sui : balance.token;
	const currentRate = isBuy ? rate.suiToToken : rate.tokenToSui;

	const isValid = () => {
		if (!amount || isLoading) return false;
		const numAmount = parseFloat(amount);
		if (isNaN(numAmount) || numAmount <= 0) return false;

		if (isBuy) {
			return numAmount <= balance.sui;
		} else {
			return numAmount <= balance.token;
		}
	};

	const handlePercentageClick = (value: number) => {
		if (isLoading) return;
		
		const amount = isBuy
			? (value).toString()
			: floor(currentBalance * value, 2).toString();
		setAmount(amount);
	};

	return (
		<div className="space-y-4">
			<div className="flex justify-between items-center">
				<div className="flex items-center gap-2">
					<span className="text-xs text-muted-foreground">
						{isBuy ? "SUI" : coinInfo.symbol} BALANCE:{" "}
						{formatNumber(currentBalance, 9)}
					</span>
				</div>
			</div>

			<div className="grid grid-cols-4 gap-2">
				{percentages.map((value) => (
					<button
						key={value}
						onClick={() => handlePercentageClick(value)}
						className="px-2 py-1 text-sm bg-background border border-border rounded hover:bg-accent"
						disabled={isLoading}
					>
						{isBuy ? value : `${value * 100}%`}
					</button>
				))}
			</div>

			<div className="relative">
				<input
					type="text"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					className="w-full bg-background border border-border p-2 rounded"
					placeholder="0"
					disabled={isLoading}
				/>
				<div className="absolute right-2 flex items-center top-1/2 -translate-y-1/2">
					<span className="text-sm text-muted-foreground">
						{isBuy ? "SUI" : coinInfo.symbol}
					</span>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<span className="text-sm">
					{`${calculateOutputAmount(amount, currentRate)} ${
						isBuy ? coinInfo.symbol : "SUI"
					}`}
				</span>
			</div>

			<div className="flex items-center justify-between text-xs text-muted-foreground">
				<span>
					{`1 ${isBuy ? "SUI" : coinInfo.symbol} ≈ ${formatNumber(currentRate, 6)} ${
						isBuy ? coinInfo.symbol : "SUI"
					}`}
				</span>
			</div>

			<button
				onClick={onSubmit}
				disabled={isLoading || !isValid()}
				className={`w-full ${
					isBuy
						? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
						: "bg-red-500/20 text-red-400 hover:bg-red-500/30"
				} text-base py-3 rounded relative disabled:opacity-50 disabled:cursor-not-allowed`}
			>
				{isLoading
					? "Pending..."
					: !amount
						? "Enter Amount"
						: !isValid()
							? "Insufficient Balance"
							: "PLACE TRADE"}
			</button>
		</div>
	);
}
