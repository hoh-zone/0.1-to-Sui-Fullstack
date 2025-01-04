import { createProfileTx, queryState } from "@/lib/contracts";
import { WalletStatus } from "@/WalletStatus";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { State } from "@/type";

/**
 * The main app component
 */
function App() {
  // State variables for the UI
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [state, setState] = useState<State | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const currentUser = useCurrentAccount();

  useEffect(() => {
    /**
     * Fetch the global state of the application
     */
    const fetchState = async () => {
      const state = await queryState();
      console.log(state);

      setState(state);
      const userHasProfile = state.users.some((user) => user.owner === currentUser?.address);
      setHasProfile(userHasProfile);
    }
    fetchState();
    // if (state) {
    //   console.log(state, "state");
    //   state.users.forEach((user) => {
    //     if (user.owner === currentUser?.address) {
    //       setHasProfile(true);
    //     }
    //   })
    // }
  }, [currentUser])

  /**
   * Handle the profile creation
   */
  const handleCreateProfile = async () => {
    if (!currentUser) {
      console.log("User not connected");
      return;
    }
    const tx = await createProfileTx(name, description);
    signAndExecute({
      transaction: tx
    }, {
      onSuccess: () => {
        console.log("Profile created");
      },
      onError: (error) => {
        console.log(error);
      }
    });
  }

  return (
    <div className="h-screen bg-gray-100">
      <header className="border-b border-gray-200">
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-blue-500">
                DApp
              </span>
            </div>
            <ConnectButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" />
          </div>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center h-screen bg-gray-800">
        <div className="flex flex-col items-center justify-center p-4 shadow-md rounded-md bg-gray-700 w-1/2">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold tracking-tighter text-white">Create Profile</h1>
              <p className="text-gray-400">
                Enter your details to create your on-chain profile
              </p>
            </div>
            {currentUser && hasProfile ? <WalletStatus /> : <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-400">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full p-2 pl-10 text-base text-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium text-white">
                  Bio
                </label>
                <textarea
                  id="bio"
                  placeholder="Tell us about yourself"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="block w-full p-2 pl-10 text-sm text-white rounded-lg border border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button onClick={handleCreateProfile} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
                Create Profile
              </button>
            </div>
            }
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
