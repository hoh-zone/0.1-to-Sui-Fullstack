import { getFullnodeUrl,SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
  
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0xa0bd1e3416e0fbe9bd67d6bb159721d5e0d8fa37edc1a7f56e8916a2b0affc51",
      state:"0x3cf9714c963ddfcce65eb6ff2095a7135c2e6f3eb251286253bd19a401633421",
      coin:"0x16401d115215d1f606d548fc003bc37d81ae10afbd27bc3840f6f91e9bb11251"
    },
   
  });

const suiClient = new SuiClient ({
    url:networkConfig.testnet.url,
  });

export { useNetworkVariable, useNetworkVariables, networkConfig,suiClient};
