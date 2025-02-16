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

export function createFolderTx(name: string, description: string, profileId: string) {
  const tx = new Transaction();
  tx.moveCall({
      package: networkConfig.testnet.packageId,
      module: "profile",
      function: "create_folder",
      typeArguments: [],
      arguments: [
        tx.pure.string(name),
        tx.pure.string(description),
        tx.object(profileId)
      ],
  })

  return tx
}

export function addCoinToolderTx(folderId: string, coinId: string, coinType: string, amount: number) {
  const tx = new Transaction();
  tx.setGasBudget(100000000)
  const [depositCoin] = tx.splitCoins(tx.object(coinId), [tx.pure.u64(amount)]);
  tx.moveCall({
    package: networkConfig.testnet.packageId,
    module: "profile",
    function: "add_coin_to_folder",
    typeArguments: [coinType],
    arguments: [
      tx.object(folderId),
      tx.object(depositCoin)
    ],
  })
  return tx
}

export function addNftToFolderTx(
  folderId: string,
  nftId: string,
  nftType: string,
): Transaction {
  const tx = new Transaction();
  console.log(folderId, nftId, nftType)
  tx.moveCall({
    package: networkConfig.testnet.packageId,
    module: "profile",
    function: "add_nft_to_folder",
    typeArguments: [nftType],
    arguments: [
      tx.object(folderId),
      tx.object(nftId),
    ],
  });
  return tx;
}
