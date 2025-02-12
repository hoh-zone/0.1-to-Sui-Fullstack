import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("mainnet"),
      packageID: "0x92bb2702137a97032f8b4b77076ee5f143e98847408111bd6974d112329debd9",
      stateID:"0xb9d9dd11c959ea870e0ba7d1c87a43fddd4317aec16ebf49d45fc68d987048d7",
    },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
