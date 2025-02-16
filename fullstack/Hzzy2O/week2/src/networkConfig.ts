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
      packageId: "0x75e59ca392ad78f088c8d2be3c4366764f07d0f175756c73d6fbfe6b6e2bbf3a",
      allProfile: "0xb1a4da1d438b1c577a8f43d4ba15b91c61d397326b4c06b27f0fcbe357e9e967"
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
