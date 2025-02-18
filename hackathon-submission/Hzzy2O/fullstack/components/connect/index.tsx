import type { ButtonHTMLAttributes, ReactNode } from "react";

import Dropdown from "./Dropdown";
import { Button } from "@/components/ui/button";
import Lain from "@/components/ai/Lain";
import {
	useCurrentAccount,
	ConnectModal,
} from "@mysten/dapp-kit";
import Balance from "./Balance";

type ConnectButtonProps = {
	connectText?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function ConnectButton({
	connectText = "Connect Wallet",
	...buttonProps
}: ConnectButtonProps) {
	const currentAccount = useCurrentAccount();
	return currentAccount ? (
		<div className="flex gap-4">
			<Lain />
			<Balance currentAccount={currentAccount} />
			<Dropdown currentAccount={currentAccount} />
		</div>
	) : (
		<ConnectModal
			trigger={
				<Button {...buttonProps} size="xs">
					<span className="rgb text-white">{connectText}</span>
				</Button>
			}
		/>
	);
}
