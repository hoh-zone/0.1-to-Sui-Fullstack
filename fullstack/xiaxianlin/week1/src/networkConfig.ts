import { getFullnodeUrl } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { TASK1_PACKAGE_ID, TASK1_SHARE_STATE_ID } from "./constants";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      task1PackageId: TASK1_PACKAGE_ID,
      task1StateId: TASK1_SHARE_STATE_ID,
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      task1PackageId: TASK1_PACKAGE_ID,
      task1StateId: TASK1_SHARE_STATE_ID,
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      task1PackageId: TASK1_PACKAGE_ID,
      task1StateId: TASK1_SHARE_STATE_ID,
    },
  });

export { useNetworkVariable, useNetworkVariables, networkConfig };
