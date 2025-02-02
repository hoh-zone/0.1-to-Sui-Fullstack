import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { SuiGraphQLClient } from "@mysten/sui/graphql";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x251cd742f2f8b0f3c9cae3a761e05a27f474d659ca4e8e39594ab78894ba3e4a",
      stateID:"0x57ace3a06f8852a151e6e144378967d9652f309987cb7b0fe2f5340308c32b8c",
    },
});

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

const suiGraphQLClient = new SuiGraphQLClient({
  url: `https://sui-testnet.mystenlabs.com/graphql`,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient, suiGraphQLClient};
