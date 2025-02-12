import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { SuiGraphQLClient } from "@mysten/sui/graphql";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x9bbc25ad0a2b33c175a340107b98cfa4f62c0eed4b9ed874753a99137f1abb75",
      stateID:"0xf28cd521c81aaa9aee743a33cf9d53147f171578a4476cbd5aa833925b55af17",
    },
});

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

const suiGraphQLClient = new SuiGraphQLClient({
  url: `https://sui-testnet.mystenlabs.com/graphql`,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient, suiGraphQLClient};
