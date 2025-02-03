import { Transaction } from "@mysten/sui/transactions";
import { networkConfig } from './networkConfig'

export function addProfileTx(name: string) {
  const tx = new Transaction();
  tx.moveCall({
    package: networkConfig.testnet.packageId,
    module: 'profile',
    function: 'add_profile',
    arguments: [
      tx.pure.string(name),
      tx.object(networkConfig.testnet.allProfile)
    ]
  })

  return tx
}
