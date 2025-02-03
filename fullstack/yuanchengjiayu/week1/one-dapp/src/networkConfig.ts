import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    // devnet: {
    //   url: getFullnodeUrl("devnet"),
    // },
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0xe779c13bdddd16241896f15fc56bfa448d6e661b63df5e46be6ef31a063645e4",
      state: "0xa17ffd9916089dde4fae2e0b24a29ff858a7af787e635ccb7ed77bed5180ad6d",
    },
    // mainnet: {
    //   url: getFullnodeUrl("mainnet"),
    // },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
