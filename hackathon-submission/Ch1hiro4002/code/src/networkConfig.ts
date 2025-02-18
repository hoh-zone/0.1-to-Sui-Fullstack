import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0xcbfce756649a643c8117b0289eda4c6353a18907d463104947e71775e26f833f",
    },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };