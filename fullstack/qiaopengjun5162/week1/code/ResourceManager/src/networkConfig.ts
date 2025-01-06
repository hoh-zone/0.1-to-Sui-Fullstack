import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0xa732060e4a37ec9abb8aa436739e423916d807569890a0ad068726bc481e1e74",
      state: "0x23f584b9fd03364882f1eaf6a8354f14d7707591c50c462aad60c52ac4de20e3",
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const suiClient = new SuiClient({ url: networkConfig.testnet.url });

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
