import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageId: "0x325032c83bf939c7238bf0ab5ca47d905cacac77ff2be8c35f18e0fb78d29a22",
      allProfile: "0x8788f3487c8eb88d46c255ff650d3c6505023bf29d59293012667a28f471fa39"
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const client = new SuiClient({
  url: networkConfig.testnet.url,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, client };
