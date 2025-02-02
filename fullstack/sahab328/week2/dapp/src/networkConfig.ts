import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { SuiGraphQLClient } from "@mysten/sui/graphql";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0xdf16c636beba84b4f18ada1b39427575f2d664ebe3d036afebfeed3597ccbc8b",
      stateID:"0xf886a31894f4651fc0df45386e607002f439c81739d17ad149900e6b0f7fabe0",
    },
});

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

const suiGraphQLClient = new SuiGraphQLClient({
  url: `https://sui-testnet.mystenlabs.com/graphql`,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient, suiGraphQLClient};
