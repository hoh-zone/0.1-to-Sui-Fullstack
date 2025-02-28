import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { SuiGraphQLClient } from "@mysten/sui/graphql";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0x476db88358529a6da1840f67b953288d0c9a67297d7e9cabf9552650ba7b33fa",
      stateID:"0x89fefd7acf09dbae797c9377e05936ff1a26cfe105df09e55d857ad037f750e7"
    }
  });

  const suiClient = new SuiClient({
    url: networkConfig.testnet.url
  })

  const suiGraphQLClient = new SuiGraphQLClient({
    url: `https://sui-testnet.mystenlabs.com/graphql`,
  });
  
  //创建并导出了 suiClient，可以在应用其他地方直接使用这个客户端

export { useNetworkVariable, useNetworkVariables, networkConfig,suiClient,suiGraphQLClient };
