import { getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x8964d4929d5def8be58e6c09fed9f132130f9b38b06859ec0b2fc714185fdd9c",
      state:"0x32ef700aa2342f91f3b607987f7267e88f997d67e302cb7ef0bb7a89ddb50691"
    },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

const suiGraphQLClient = new SuiGraphQLClient({
  url: `https://sui-testnet.mystenlabs.com/graphql`,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient, suiGraphQLClient };
