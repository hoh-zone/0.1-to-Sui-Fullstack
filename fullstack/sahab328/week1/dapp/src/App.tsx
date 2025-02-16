import { ConnectButton, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { createProfileTx, queryState } from "./lib/contracts";

function App() {

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  useEffect(() => {
    const fetchData = async () => {
      const state = await queryState();
      console.log(state);
    };
    fetchData();
  }, []);

  const handleCreateProfile = async () => {
    const tx = await createProfileTx(name, description);
    signAndExecuteTransaction({
      transaction: tx,
    }, {
      onSuccess: () => {
        console.log("Create Profile Successful");
      },
      onError: (error) => {
        console.error(error);
      }
    });
  };

  
  return (
    <>
      <header className="flex items-center justify-between px-6 py-4 bg-gray-600 shadow-md">
        <div className="text-xl font-bold text-white">
          Manager
        </div>
        <div>
          <ConnectButton />
        </div>
      </header>

      <main className="flex flex-col items-center justify-center p-6">
        <form className="w-full max-w-md bg-gray-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-300 mb-6">Create Your Profile</h2>
          {/* 输入姓名的字段 */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>

          {/* 输入描述的字段 */}
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a description"
            ></textarea>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCreateProfile}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create
            </button>
          </div>
        </form>
      </main>
    </>
  );
}

export default App;
