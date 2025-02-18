import { ConnectButton } from "@mysten/dapp-kit";
import Link from "next/link";

function Header() {
  return (
    <div className="border-b">
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        <div
          className="hover:cursor-pointer text-2xl font-bold"
        >
          <Link href="/">Sui Profile Manager</Link>
        </div>
        <ConnectButton />
      </div>
    </div>
  );
}

export default Header;
