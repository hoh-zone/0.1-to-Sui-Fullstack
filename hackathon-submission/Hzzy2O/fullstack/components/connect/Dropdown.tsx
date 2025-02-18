import type { WalletAccount } from '@mysten/wallet-standard';

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAccounts, useDisconnectWallet, useResolveSuiNSName, useSwitchAccount } from "@mysten/dapp-kit";

import { Copy, ChevronDown, Layers2, LogOut, UserPen } from "lucide-react";
import { formatAddress } from '@mysten/sui/utils';
import { blo } from "blo"

type DropdownProps = {
  currentAccount: WalletAccount
}

export default function Dropdown({currentAccount}: DropdownProps) {
  const { mutate: disconnectWallet } = useDisconnectWallet();
	 const { data: domain } = useResolveSuiNSName(
		currentAccount.label ? null : currentAccount.address,
	);
	const accounts = useAccounts().filter((acc) => acc.address !== currentAccount.address);
  const { mutate: switchAccount } = useSwitchAccount();
  const name = currentAccount.label ?? domain ?? formatAddress(currentAccount.address)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-auto py-1 px-2 sm:border sm:border-indigo-700 bg-black text-white hover:bg-indigo-900">
          <Avatar>
            <AvatarImage src={blo(currentAccount.address as `0x${string}`)} alt="Profile image" />
          </Avatar>
          <span className='hidden sm:inline-block'>{name}</span>
          <ChevronDown size={16} strokeWidth={2} color='white' className="opacity-60" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-64 bg-black text-white border-neutral-700 shadow-md shadow-neutral-700">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-white">{name}</span>
          {
            (currentAccount.label || domain) ? (
              <span className="truncate text-xs font-normal text-muted-foreground">
                {formatAddress(currentAccount.address)}
              </span>
            ) : null
          }
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='bg-neutral-700' />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Copy size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
            <span>Copy</span>
          </DropdownMenuItem>
          {/* <DropdownMenuItem> */}
          {/*   <Layers2 size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" /> */}
          {/*   <span>Profile</span> */}
          {/* </DropdownMenuItem> */}
        </DropdownMenuGroup>
        {accounts.length > 0 && <DropdownMenuSeparator className='bg-neutral-700' />}
        <DropdownMenuGroup>
          {accounts.map((account) => (
            <DropdownMenuItem key={account.address} onClick={() => switchAccount({account})}>
              <UserPen size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
              <span>{formatAddress(account.address)}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className='bg-neutral-700' />
        <DropdownMenuItem onClick={() => disconnectWallet()}>
          <LogOut size={16} strokeWidth={2} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
