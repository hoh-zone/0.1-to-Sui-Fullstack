import { getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x2c9657bd89b0bace3ed16a988492bbcf9e2bd672da174bfdfc3bdae7d55d508b",
      state:"0xd6a206d5ac7725fb2e3969fc4ee451fa00d8d1d33be1cb652c0d48cc6da2d2bf"
    },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

const suiGraphQLClient = new SuiGraphQLClient({
  url: `https://sui-devnet.mystenlabs.com/graphql`,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient, suiGraphQLClient };
