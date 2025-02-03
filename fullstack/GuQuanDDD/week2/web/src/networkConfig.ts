import { getFullnodeUrl,SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { SuiGraphQLClient } from "@mysten/sui/graphql";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x9693450514cbb61f9a9ad08294811b6895387f0ea583c7efc6a4835c574e91e5",
      state:"0xb8dd06a828620edbfae9cec1028ef16e737d9de8415306fbe758ffc2f1332381"
    },
  });
const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
})

const suiGraphQLClient = new SuiGraphQLClient({
  url: `https://sui-testnet.mystenlabs.com/graphql`,
});

export { useNetworkVariable, useNetworkVariables, networkConfig,suiClient,suiGraphQLClient };
