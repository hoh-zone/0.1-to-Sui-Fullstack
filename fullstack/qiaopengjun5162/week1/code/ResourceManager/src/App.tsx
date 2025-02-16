// week1/code/ResourceManager/src/App.tsx
import { createProfileTx, queryState } from "@/lib/contracts";
import { State } from "@/type";
import { WalletStatus } from "@/WalletStatus";
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import ProfileForm from '@pages/ProfileForm'; // 引入新组件
import { useEffect, useState } from "react";

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
        const fetchState = async () => {
            const state = await queryState(null);
            console.log(state);

            setState(state);
            const userHasProfile = state.users.some((user) => user.owner === currentUser?.address);
            setHasProfile(userHasProfile);
        }
        fetchState();
    }, [currentUser]);

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
                            <span className="text-2xl font-bold text-blue-500">DApp</span>
                        </div>
                        <ConnectButton className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md" />
                    </div>
                </div>
            </header>

            <main className="flex flex-col items-center justify-center h-screen bg-gray-800">
                <div className="flex flex-col items-center justify-center p-4 shadow-md rounded-md bg-gray-700 w-1/2">
                    <ProfileForm
                        name={name}
                        setName={setName}
                        description={description}
                        setDescription={setDescription}
                        handleCreateProfile={handleCreateProfile}
                    />
                    {currentUser && hasProfile ? (
                        <div className="w-full">
                            <WalletStatus />
                        </div>
                    ) : (
                        <div className="mt-4">
                            <p className="text-white">请先创建个人资料</p>
                        </div>
                    )}
                </div>
                {currentUser && hasProfile && (
                    <div className="mt-4 text-white">
                        <p>欢迎回来，{currentUser.address}!</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
