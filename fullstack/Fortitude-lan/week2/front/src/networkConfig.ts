/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Hesin
 * @Date: 2025-01-02 21:05:44
 * @LastEditors: Hesin
 * @LastEditTime: 2025-01-15 21:27:50
 */

import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { SuiGraphQLClient } from "@mysten/sui/graphql";
const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    // devnet: {
    //   url: getFullnodeUrl("devnet"),
    // },
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x9939de8a93eab46862230e378ae9f5777050d94367ea771c050558ea0b8837d8",
      state: "0xc61e06844c2fcf37f58c6a250301cf93de0cd0d3a5cc27e12989af02e8fbff8d"
    },
    // mainnet: {
    //   url: getFullnodeUrl("mainnet"),
    // },
  });
const suiClient = new SuiClient({
  url: networkConfig.testnet.url
})

const suiGraphQLClient = new SuiGraphQLClient({
  url: `https://sui-testnet.mystenlabs.com/graphql`,
});
export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient, suiGraphQLClient };
