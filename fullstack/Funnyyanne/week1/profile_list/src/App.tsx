import { ConnectButton } from "@mysten/dapp-kit";
import { ContractInteraction } from "./ContractInteraction";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ProfileList } from "./ProfileList";
import { CoinsList } from "./CoinsList";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-blue-50">
        <div className="bg-blue-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-white font-handwriting">Profile Manager</h1>
              <div className="flex items-center gap-4">
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-8">
          <button
            onClick={() => window.location.href = '/profiles'}
            className="px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 mr-4 font-handwriting"
          >
           Profiles
          </button>
          <button
            onClick={() => window.location.href = '/coins'} 
            className="px-8 py-3 text-lg font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 font-handwriting"
          >
            Coins
          </button>
        </div>
        <Routes>
          <Route path="/" element={<ContractInteraction />} />
          <Route path="/profiles" element={<ProfileList />} />
          <Route path="/coins" element={<CoinsList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
