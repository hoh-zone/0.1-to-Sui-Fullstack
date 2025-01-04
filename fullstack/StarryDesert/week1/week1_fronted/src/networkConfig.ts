import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
        packageID: "0x566c28cd28f84b05aa3ae238b228c2b69f08f58631b6ecf25935e359a7989023",
        userServer: "0x741f071c75803cc782f807f7257f97dcfdbc78e1aed78f759acb710939707548",
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
