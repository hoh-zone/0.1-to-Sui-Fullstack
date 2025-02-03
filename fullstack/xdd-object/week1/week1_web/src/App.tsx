import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { WalletStatus } from "./WalletStatus";
import { useEffect, useState } from "react";
import { createProfile, getProfile, queryObject, queryState } from "./lib/contracts";

function App() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [profileId, setProfileId] = useState("");
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const [profileData, setProfileData] = useState<any>(null);
  // const [walletAddress, setWalletAddress] = useState("");
  const currentAccount = useCurrentAccount();
  const [profileInfo, setProfileInfo] = useState<any>(null);
  

  useEffect(() => {
    const fetchState = async () => {
      const state = await queryState();
      console.log(state);
    };
    fetchState();
  }, []);

  const handleQueryProfile = async () => {
    
    console.log("Connected wallet address:", currentAccount?.address);

    const data = await queryObject(profileId);
    console.log("data", data);
    setProfileData({
      name: data.data?.content?.fields?.name,
      desc: data.data?.content?.fields?.desc
    });
    console.log("profileData", profileData);

    
  };

  const handleGetProfile = async () => {
    const tx = await getProfile();
    tx.setGasBudget(1000000000);
    const res = await signAndExecute({
      transaction: tx,
    }, {
      onSuccess: (result) => {
        console.log("getProfile", result);
        // setProfileInfo(result);
      },
      onError: (error) => {
        console.error("Error getProfile", error);
      }
    });
    
    console.log("res", res);
  };


  const handleCreateProfile = async () => {
    const tx = await createProfile(name, desc);
    tx.setGasBudget(1000000000);
    signAndExecute({
      transaction: tx,
    }, {
      onSuccess: (result) => {
        console.log("Profile created", result);
        setName("");
        setDesc("");
      },
      onError: (error) => {
        console.error("Error creating profile", error);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                Profile Creator
              </h1>
            </div>
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-100">Create Your Profile</h2>
            
            {/* Form */}
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-100 placeholder-gray-400"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Tell us about yourself"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-100 placeholder-gray-400 resize-none"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </div>

              <button
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                onClick={handleCreateProfile}
                disabled={!name || !desc}
              >
                Create Profile
              </button>
            </div>
          </div>
        </div>
      </main>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-100">Query Profile</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="profileId" className="block text-sm font-medium text-gray-300 mb-1">
                  Profile ID
                </label>
                <input
                  id="profileId" 
                  type="text"
                  placeholder="Enter profile ID"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-gray-100 placeholder-gray-400"
                  value={profileId}
                  onChange={(e) => setProfileId(e.target.value)}
                />
              </div>

              <button
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                onClick={handleQueryProfile}
                disabled={!profileId}
              >
                Query Profile
              </button>

              {profileData && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-100 mb-2">Profile Details</h3>
                  <p className="text-gray-300"><span className="font-medium">Name:</span> {profileData.name}</p>
                  <p className="text-gray-300"><span className="font-medium">Description:</span> {profileData.desc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold text-gray-100">Get Profile</h2>
            
            <div className="space-y-4">
              <button
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 font-medium focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                onClick={handleGetProfile}
              >
                Get Profile
              </button>

              {profileInfo && (
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-100 mb-2">Profile Address</h3>
                  <p className="text-gray-300 break-all">{profileInfo}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6">
        <div className="text-center text-gray-400 text-sm">
          {/* <WalletStatus /> */}
        </div>
      </footer>
    </div>
  );
}

export default App;
