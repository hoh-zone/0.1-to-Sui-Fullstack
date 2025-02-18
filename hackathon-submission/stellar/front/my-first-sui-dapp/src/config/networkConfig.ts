import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
        packageID:"0xc6b1030d1960380e0fe6129ba27d0d249eedc9ef7ed25e2323933adb6c99cfef",
        stateID:"0x26dad8a9c5cc20e0f49fbcb004451c7620bbad3ffc493a93f9618fb9828b599e",
        booksID:"0x622d40548771e0026b084dd7bc1a7f25949cc6c41d794fe7bceac30685b30ec2",
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const suiClient = new SuiClient({
    url:networkConfig.testnet.url,
})
export { useNetworkVariable, useNetworkVariables, networkConfig,suiClient };
