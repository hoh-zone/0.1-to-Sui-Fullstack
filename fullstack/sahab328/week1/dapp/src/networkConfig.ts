import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x692fd63d2bba4bdd404aa5b8aa644d46f309aaa9bab31cc171782a9d50a94f47",
      stateID:"0x11de3466ce209b83b4db6688a043ebdeff44d85e09e1022ca5a7007f269dc120",
    },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
