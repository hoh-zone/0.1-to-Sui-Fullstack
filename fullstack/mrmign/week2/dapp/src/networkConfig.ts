import { getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x5f9f98050ce7e386736e8333e768ffd1943f56d5664f0dfd27016c5d5b5bac28",
      state:"0xe3b833b0f597ffb81febc6aea682ac9718899d815bdd505a318aea7df166e4c7"
    },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

const suiGraphQLClient = new SuiGraphQLClient({
  url: `https://sui-testnet.mystenlabs.com/graphql`,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient, suiGraphQLClient };
