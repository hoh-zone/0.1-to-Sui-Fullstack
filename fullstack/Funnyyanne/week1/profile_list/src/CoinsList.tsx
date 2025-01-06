import { useEffect, useState } from "react"
import { useCurrentAccount } from "@mysten/dapp-kit"
import { SuiClient } from "@mysten/sui.js/client"

export function CoinsList() {
  const [coins, setCoins] = useState<any[]>([])
  const currentAccount = useCurrentAccount()
  
  useEffect(() => {
    const fetchCoins = async () => {
      if (!currentAccount?.address) return

      const client = new SuiClient({
        url: "https://fullnode.testnet.sui.io:443"
      })

      try {
        const coinsData = await client.getCoins({
          owner: currentAccount.address
        })
        setCoins(coinsData.data)
      } catch (error) {
        console.error("Error fetching coins:", error)
      }
    }

    fetchCoins()
  }, [currentAccount])

  return (
    <div className="min-h-screen bg-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-blue-100 bg-blue-600">
            <h2 className="text-2xl font-semibold text-white font-handwriting">My Coins</h2>
          </div>
          
          <div className="divide-y divide-blue-100">
            {coins.map((coin, index) => (
              <div key={index} className="p-6 hover:bg-blue-50 transition-colors duration-200">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-blue-900 font-handwriting">
                      Coin Type: {coin.coinType}
                    </h3>
                    <p className="text-blue-600 mt-1 font-handwriting">
                      Balance: {coin.balance}
                    </p>
                    <p className="text-sm text-blue-400 mt-2 font-handwriting">
                      Object ID: {coin.coinObjectId}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
