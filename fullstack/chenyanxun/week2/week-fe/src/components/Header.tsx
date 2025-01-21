import { ConnectButton } from "@mysten/dapp-kit";
import { useNavigate } from "react-router-dom";

function Header() {
  const nav = useNavigate();
  return (
    <div className="border-b">
      <div className="container mx-auto px-4 flex justify-between items-center h-20">
        <div
          className="hover:cursor-pointer text-2xl font-bold"
          onClick={() => nav("/")}
        >
          Sui Profile Manager
        </div>
        <ConnectButton />
      </div>
    </div>
  );
}

export default Header;
