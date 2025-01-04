import { getFullnodeUrl,SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0xdc26d28be8d3c2dab0d72050f5a3956939e8c112c7d5724769c06d185820efe2",
      state:"0x0ce4744d8e370eb8abc98768e3322524a971b1985a63d83d576e714789d65c70"
    },
  });
const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
})

export { useNetworkVariable, useNetworkVariables, networkConfig,suiClient };
