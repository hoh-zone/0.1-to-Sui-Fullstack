import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { createProfileTx, queryState } from "./lib/contracts";
import { State } from "./type";
import { WalletStatus } from "./WalletStatus";
import { Routes, Route, Link } from "react-router-dom";

function App() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [state, setState] = useState<State | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const currentUser = useCurrentAccount();

  useEffect(() => {
    const fetchState = async () => {
      const state = await queryState();
      setState(state);
    };
    fetchState();
    if (state) {
      state.users.forEach((user) => {
        if (user.owner === currentUser?.address) {
          setHasProfile(true);
        }
      });
    }
  }, [currentUser]);

  const handleCreateProfile = async () => {
    if (!currentUser) {
      console.log("用户没有连接");
      return;
    }
    const tx = await createProfileTx(name, description);
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          console.log("创建文件");
        },
        onError: (error) => {
          console.log(error);
        },
      },
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="min-h-screen bg-background">
            <header className="border-b">
              <div className="container mx-auto">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate__animated animate__bounce">
                      WeekOne_DApp
                    </span>
                  </div>
                  <ConnectButton />
                </div>
              </div>
            </header>

            <main className="container mx-auto py-8">
              <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-md space-y-6">
                  <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold tracking-tighter animate__animated animate__fadeInDown">
                      {hasProfile ? 'Update Profile' : 'Create Profile'}
                    </h1>
                    <p className="text-muted-foreground animate__animated animate__fadeInUp">
                      {hasProfile 
                        ? 'Update your on-chain profile details'
                        : 'Enter your details to create your on-chain profile'
                      }
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="bio"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Description
                      </label>
                      <textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                    </div>

                    <div className="space-y-6">
                      <button
                        onClick={handleCreateProfile}
                        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm"
                      >
                        {hasProfile ? 'Update Profile' : 'Create Profile'}
                      </button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="bg-background px-2 text-gray-500">or</span>
                        </div>
                      </div>

                      <Link to="/wallet-status" className="block">
                        <button className="inline-flex w-full items-center justify-center rounded-md bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm transition-colors">
                          View Wallet Status
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        }
      />
      <Route path="/wallet-status" element={<WalletStatus />} />
    </Routes>
  );
}

export default App;
