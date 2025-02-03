import { getFullnodeUrl , SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x86a801bb7fa62b4cdde7899788ff1ebfd797682c0c757ed51d8e8cb3ceb009c2",
      state:"0xc83d5b88c9e00fd4a0a0d7fa3fbfe1f58b474b9a9a19c2befecaefeabd3a2d43"
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

  const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
  });
  

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
