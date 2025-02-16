import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0xf726569a24a4a4821812fb07b94591ff80d540753a848da6eb2d1d2261a3c262",
      State: "0x2f26e3a408dfaf5ff5d5871e3957e1db999a2e262436ce60004633062bcc1f58",
    },
  });

  const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
  });

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };
