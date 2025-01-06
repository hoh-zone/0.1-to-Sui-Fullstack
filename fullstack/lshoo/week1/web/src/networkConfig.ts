import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x2ed891140e4b9ac7b5b968b21934d3c4013c9fcd9f8b6e5dd19f71807182ef81",
      state: "0xa898a3618285361ad238da5f413fd0c10c1247f882636d18e5c5b2e374781cfe",
    },
    
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
