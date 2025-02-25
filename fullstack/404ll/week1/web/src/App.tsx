import {
  ConnectButton,
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createProfile, queryState } from "./contracts";
import { State } from "./type";
import "./index.css";

// import Image from "next/image";
function App() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const account = useCurrentAccount();
  const [state, setState] = useState<State | null>(null);

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const handleCreatedProfile = async () => {
    const tx = await createProfile(name, description);
    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          console.log("success");
        },
        onError: () => {
          console.log("Error");
        },
      },
    );
  };

  useEffect(() => {
    const fetchState = async () => {
      const state = await queryState();
      setState(state);
    };
    fetchState();
    console.log("state", state);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center p-4 bg-white shadow-md">
        {/* <Image
        src=".
        /logo.png"
        alt="logo"
        width="100"
        height="100"
         /> */}
        <div className="flex items-center ">
          <span className="text-xl">Logo</span>
        </div>
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="flex flex-col justify-center items-center p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
          <div className="flex flex-col items-center">
            <p className="text-2xl font-semibold mb-4">Create Profile</p>
            <div className="flex flex-col items-center">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mb-2 p-3 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="p-3 border border-black rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              <Button
                className="mt-4 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                onClick={handleCreatedProfile}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
