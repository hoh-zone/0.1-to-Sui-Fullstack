import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID:
        "0x3cba1f04cd295907b4870d703e7a715bdb426b15e7e4925e9edfec06ab51ce62",
      stateObjectID:
        "0x6ee75f9e8cbfd410b662c69c6131d38c02397b8365810a018fc5ebab91ed6e1d",
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const suiClient = new SuiClient(networkConfig.testnet);

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
