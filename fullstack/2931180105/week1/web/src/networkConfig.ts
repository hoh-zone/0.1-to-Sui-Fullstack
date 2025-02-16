import { getFullnodeUrl,SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
  
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x992e68264552e24e668f2c8b9c572630a90a36153e5a9deb0226bb14512fea31",
      state:"0xcf302be62565efdbae0884a56fd37b0ba0bc72e61a4f089742e62cd0aec88d53"
    },
   
  });

const suiClient = new SuiClient ({
    url:networkConfig.testnet.url,
  });

export { useNetworkVariable, useNetworkVariables, networkConfig,suiClient};
