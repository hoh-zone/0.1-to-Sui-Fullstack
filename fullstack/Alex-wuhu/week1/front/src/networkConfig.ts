import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("devnet"),
      packageID: "0xfc728489dea62ac38b211b7e54626052ac9c8789f2d8f18738d2d9122263fa39",
      state:"0x1980b46ede36b4ef1c43bed5cb8422e30e8e32d95b95e8e850956a1c9bee570a"
    },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

export { useNetworkVariable, useNetworkVariables, networkConfig, suiClient };

/*
test net
  pkgid : 0x158ade43378dd8677da8cd04b017d4eb8be7f3850165bf7d8e2f9c8dda2824e5
  state id : 0x6d7d2f3f2cae7dd1b5451f814e01ff45482562216f2b6ade975fe124babf3772
dev net 
  pkgid : 0xfc728489dea62ac38b211b7e54626052ac9c8789f2d8f18738d2d9122263fa39
  state id : 0x1980b46ede36b4ef1c43bed5cb8422e30e8e32d95b95e8e850956a1c9bee570a


*/