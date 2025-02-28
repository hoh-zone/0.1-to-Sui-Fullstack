import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x6afc488b45f2398fb2374ba9a5706048a5dcc3191c92b7e1f0b6cb9af9901630",
      stateID:"0x9e48626738b05c6763ddea3fda600b323d77843a51d791f9ede871acd65778a8"
    }
  });

  const suiClient = new SuiClient({
    url: networkConfig.testnet.url
  })
  //创建并导出了 suiClient，可以在应用其他地方直接使用这个客户端

export { useNetworkVariable, useNetworkVariables, networkConfig,suiClient };
