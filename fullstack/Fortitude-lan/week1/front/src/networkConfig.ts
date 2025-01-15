/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2025-01-02 21:05:44
 * @LastEditors: Hesin
 * @LastEditTime: 2025-01-06 17:21:30
 */

import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    // devnet: {
    //   url: getFullnodeUrl("devnet"),
    // },
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID:"0x181a5d143d22bda66a87362b5380d24935f2bd1609d3089c55716ba8e109024e",
      state:"0xc1b89f128c46bc00e40177c1a9c6a9e053f8532b45f18d3d71f7bfe05ae6a951"
    },
    // mainnet: {
    //   url: getFullnodeUrl("mainnet"),
    // },
  });
const suiClient = new SuiClient({
  url:networkConfig.testnet.url
})
export { useNetworkVariable, useNetworkVariables, networkConfig,suiClient };
