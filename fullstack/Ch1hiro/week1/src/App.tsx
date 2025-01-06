import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { createProfile, queryState } from "./contracts/contracts_tx";
import { State, User } from "./type/struct_type";
import "./styles/App.css";

function App() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const {mutate: signAndExecute} = useSignAndExecuteTransaction();
  const [state, setState] = useState<State | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [profiles, setProfiles] = useState<User[]>([]);
  const currentUser = useCurrentAccount();

  useEffect(() => {
    const fetchState = async () => {
      const state = await queryState();
      setState(state);
      if (state) {
        const userProfiles = state.users.filter(user => user.owner === currentUser?.address);
        setProfiles(userProfiles); // 将当前用户的所有资料保存到 profiles 状态中
        setHasProfile(userProfiles.length > 0); // 如果当前用户有资料，则设置为 true
      }
    };
    fetchState();
  }, [state,currentUser]);

  interface ProfileCardProps {
    owner: string;
    profile: string;
  }
  // ProfileCard 组件
  const ProfileCard = ({ owner, profile }: ProfileCardProps) => {
    const profileLink = `https://suiscan.xyz/testnet/object/${profile}`;
    return (
      <div className="profile-card">
        <div className="owner"><span>Owner: </span>{owner}</div>
        <div className="profile"><span>Profile: </span><a href={profileLink}>{profile}</a></div>
      </div>
    );
  };


  const handleCreateProfile = async () => {
    if (!currentUser) {
      console.log("User not connected");
      return;
    }
    const tx = await createProfile(name, description);
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
  };

  return (
    <div className="min-h-screen bg-background">
      {/* DApp Title on the Left */}
      <div className="dapp-title-wrapper">
        <span className="text-2xl">Manage</span>
      </div>
  
      {/* Wallet Connect Button on the Right */}
      <div className="connect-btn-wrapper">
        <ConnectButton />
      </div>
  
      <main className="container">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="heading">Create Profile</h1>
              <p className="text-muted-foreground">Enter your details to create your on-chain profile</p>
            </div>
  
            {/* If currentUser has a profile, show the profile list */}
            {currentUser && hasProfile ? (
              <div className="profile-list">
                {profiles.map((profile, index) => (
                  <ProfileCard key={index} owner={profile.owner} profile={profile.profile} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="label">Name</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                  />
                </div>
  
                <div className="space-y-2">
                  <label htmlFor="bio" className="label">Bio</label>
                  <textarea
                    id="bio"
                    placeholder="Tell us about yourself"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input"
                  />
                </div>
  
                <button
                  onClick={handleCreateProfile}
                  className="button"
                >
                  Create Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
  
}

export default App;
