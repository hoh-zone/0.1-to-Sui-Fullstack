import { ConnectButton} from "@mysten/dapp-kit";

const Navi_bar = () => {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Profile Manage
            </span>
          </div>
          <ConnectButton />
        </div>
      </div>
    </header>
  );
};

export default Navi_bar;
