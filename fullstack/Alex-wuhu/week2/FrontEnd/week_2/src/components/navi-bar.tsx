import { ConnectButton } from "@mysten/dapp-kit";
import { useNavigate } from "react-router-dom";

const NaviBar = () => {
    const navigate = useNavigate();
    return (
        <header className="border-b">
        <div className="container mx-auto p-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 hover:cursor-pointer" onClick={() => navigate("/")}>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Sui Profile Manager
              </span>
            </div>
              <ConnectButton />
          </div>
        </div>
      </header>
    )
}

export default NaviBar;