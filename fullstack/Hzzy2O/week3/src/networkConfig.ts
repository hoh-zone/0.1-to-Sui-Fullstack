import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { SuiGraphQLClient } from "@mysten/sui/graphql";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageId: "0x906bced3ec8e75c048a3a8e84e16ba745395bf5864f1758837ceb61a5aab894a",
      allProfile: "0x0a747cc91e9fcd1522c2c0039af2538f39d6d420e1132704fd379a6304b67e60"
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const client = new SuiClient({
  url: networkConfig.testnet.url,
});

const suiGraphQLClient = new SuiGraphQLClient({
  url: `https://sui-testnet.mystenlabs.com/graphql`,
})

export { useNetworkVariable, useNetworkVariables, networkConfig, client, suiGraphQLClient };
