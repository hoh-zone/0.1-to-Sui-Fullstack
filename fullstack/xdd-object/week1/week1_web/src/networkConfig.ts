import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageId: "0x9aac2eb50656d430bc82d115c00d411f46371e33ea43a81d8b7f9897f88a56b7",
      stateId: "0x576c13428e8ee3efe8860ea8808dcfc18c2e1ef3a4bb3f033d1cc514971882b2",
    },
  });

  const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
  });

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
