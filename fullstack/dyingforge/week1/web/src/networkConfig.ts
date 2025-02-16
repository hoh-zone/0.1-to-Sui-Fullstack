import { getFullnodeUrl , SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x41aa4dd286306d5df35948e8916d2e7365e024c7a0548897d18dccb45b58440f",
      state:"0x71c0ec902e936fc9ff201f3a137e00cab2ea97bf192dc7c1eac991888ddcca8d"
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

  const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
  });
  

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
