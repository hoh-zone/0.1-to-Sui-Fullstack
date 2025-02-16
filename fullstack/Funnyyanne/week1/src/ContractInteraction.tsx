import { useState } from "react"
import { Button } from "@/components/ui/button"
import { create_profile, queryState } from "./lib/contracts"
import { useEffect } from "react"
import { useCurrentAccount,useSignAndExecuteTransaction } from "@mysten/dapp-kit"
import { State } from "./type/profile"
import { useNavigate } from 'react-router-dom'


export function ContractInteraction() {
  const navigate = useNavigate()

  const currentAccount = useCurrentAccount()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [state, setState] = useState<State | null>(null)
  const [hasProfile, setHasProfile] = useState(false)
  const {mutate: signAndExecute} = useSignAndExecuteTransaction();

  useEffect(() => {
    const fetchState = async () => {
      try {
        const fetchedState = await queryState();
        setState(fetchedState);
          console
        // 立即检查用户是否已有 profile
        if (currentAccount?.address && fetchedState.users) {
          const hasExistingProfile = fetchedState.users.some(
            (user) => user.owner === currentAccount.address
          );
          setHasProfile(hasExistingProfile);
        }
      } catch (error) {
        console.error('Error fetching state:', error);
      }
    };
  
    fetchState();
  }, [currentAccount]); 


  const handleCreateProfile = async()=>{
    if(!currentAccount){
      console.log("User not connected");
      return;
    }
    const tx = await create_profile(name, description);
    signAndExecute({
      transaction: tx
    },{
      onSuccess: ()=>{
        console.log("Profile created");
        navigate('/profile');
      },
      onError: (error)=>{
        console.log(error);
      }
    });
  }


  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-blue-50">
      <div className="w-full max-w-md space-y-6 bg-white rounded-3xl p-8 shadow-lg border-2 border-blue-200">
        <h1 className="text-3xl font-bold text-center text-blue-800 font-handwriting">Create Profile</h1>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white text-gray-800 placeholder-blue-300 font-handwriting"
            />
          </div>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 min-h-[120px] bg-white text-gray-800 placeholder-blue-300 font-handwriting resize-none"
            />
          </div>
        </div>
        <Button 
          onClick={handleCreateProfile}
          className={`w-full bg-blue-600 text-white font-handwriting text-lg py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${!currentAccount || hasProfile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-400'}`}
          disabled={!currentAccount || hasProfile}
          onMouseDown={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
          onMouseUp={(e) => e.currentTarget.style.backgroundColor = ''}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          Create Profile
        </Button>
      </div>
    </div>
  );
}