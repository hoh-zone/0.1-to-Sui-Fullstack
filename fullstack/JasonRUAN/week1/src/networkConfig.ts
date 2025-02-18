import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x865c9f922f4727b7ad504dbe476d303dee8aa35ce8d1114910f325d73bf430f8",
      state:"0x6215775b5fd53cd029e2169e77983cae674c459d8247f5fc2132d07e9cdaf31f"
    },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
