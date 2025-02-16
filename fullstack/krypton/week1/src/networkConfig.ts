import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    /* devnet: {
       url: getFullnodeUrl("devnet"),
    },*/
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID:"0xdcf0ce229ce741c9d2bfe11dd09b0254d1581f1981e4134a5f7f42acd7a20dea",
      state:"0x957e9e2d98d52ad1de333d50152fd71b7e901b559ae7bc7e110dca9f62a88519",
    },
    /* mainnet: {
       url: getFullnodeUrl("mainnet"),
     },*/
  });

  const suiClient=new SuiClient({
    url:networkConfig.testnet.url,
  })

export { useNetworkVariable, useNetworkVariables, networkConfig,suiClient };
