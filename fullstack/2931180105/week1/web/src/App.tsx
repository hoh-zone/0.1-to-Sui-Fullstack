import { ConnectButton,useCurrentAccount,useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect,useState } from "react";
import { createProfileTx,queryState } from "./lib/contract";
import { State } from "./type";
import { WalletStatus } from "./WalletStatus";

function App() {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const { mutate: signAndExecute } = useSignAndExecuteTransaction()
  const currentUser = useCurrentAccount();
  const [state, setState] = useState<State | null>(null);
  const [hasProfile,setHasProfile] = useState(false);

// 页面加载时执行
  useEffect(() => {
    const fetchState = async() => {
      const state = await queryState();
      setState(state);
      console.log(state);
    }
    fetchState();

    if (state) {
      state.users.forEach((user) => {
        if (user.owner === currentUser?.address) {
          setHasProfile(true);
        }
      })
    }
  },[currentUser])
  
  const handleCreateProfile = async () => {
    const tx = await createProfileTx(name, description);
    signAndExecute({
      transaction: tx,
    }, {
      onSuccess: () => {
        console.log("success");
      },
      onError: (error) => {
        console.log(error);
      }
    })
  }
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="text-2xl font-bold">
              hello
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
        {currentUser && hasProfile?<WalletStatus/>:<div className="space-y-4">
          <div className="space-y-2">
              <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-3 py-2 border rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              placeholder="Enter your description"
              className="w-full px-3 py-2 border rounded-md min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            </div>
            <div className="space-y-2">
            <button
              onClick={handleCreateProfile}
              className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Create Profile
            </button>
            </div>
          </div>}
        </div>
      </main>
    </div>
  );
}

export default App;
