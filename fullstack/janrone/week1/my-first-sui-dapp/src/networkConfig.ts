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
        "0xa015bcf5cc2f65b9e040592f7dce564a0eea2dd85bf921db037d4576cdbe7db1",
      State:
        "0xa36ebbefa69a810456b67e06f414718e451638f9870ade82f100dc6b53691af9",
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };

// export { useNetworkVariable, useNetworkVariables, networkConfig };
