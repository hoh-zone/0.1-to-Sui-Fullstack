import { getFullnodeUrl , SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0xa622032fe11c13c5221715de9968ca297b4cf8bbe21da09156d7e5c347e79ea6",
      state:"0xfb87b58005713b178288f223974e7af8519b3e6630013012b9d8c6ebd903fdee"
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

  const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
  });
  

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
