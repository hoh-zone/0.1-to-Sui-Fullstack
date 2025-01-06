/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2025-01-02 21:05:44
 * @LastEditors: Hesin
 * @LastEditTime: 2025-01-04 11:44:57
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
      packageID:"0xed15246b81303c78ab7724ceecf37c58e524ea4965e4d80f507b0f8d05003b33",
      state:"0x4ba27af4532cac53b7f8c715fb3bb77e8388b665f94ed6a0dff95f161c3cbd72"
    },
    // mainnet: {
    //   url: getFullnodeUrl("mainnet"),
    // },
  });
const suiClient = new SuiClient({
  url:networkConfig.testnet.url
})
export { useNetworkVariable, useNetworkVariables, networkConfig,suiClient };
