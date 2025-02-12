import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0xb4515d3f5c1ccd2b72431ee25601818392979bb2011c2815037032fa0342a140",
      stateID:"0xb9d9dd11c959ea870e0ba7d1c87a43fddd4317aec16ebf49d45fc68d987048d7",
    },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
