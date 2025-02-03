import { getFullnodeUrl,SuiClient } from "@mysten/sui/client";
import { createNetworkConfig, useSuiClient } from "@mysten/dapp-kit";
/**
来自合约publish 的日志  contracts/pub-test.out
 ┌──                                                                                                    │
│  │ ObjectID: 0x9ba38ffb19953692b878c733acd09237eab3ce47552dacad1d064d8c755ba8ef                         │
│  │ Sender: 0x5e23b1067c479185a2d6f3e358e4c82086032a171916f85dc9783226d7d504de                           │
│  │ Owner: Shared( 302154261 )                                                                           │
│  │ ObjectType: 0xc186d306b313a81e9bca0845b61b35ceb99c5e10018170aef06bbb63ca7e04f7::week_one_alt::State  │
│  │ Version: 302154261                                                                                   │
│  │ Digest: At6yEsNFk2d1qnuDoGX3TGiwJMi4C1sxs3Yssbo9qzsv                                                 │
│  └──      
 */
const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      state:"todo",
      pkg:"todo"
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      state:'0x9ba38ffb19953692b878c733acd09237eab3ce47552dacad1d064d8c755ba8ef',
      pkg:'0xc186d306b313a81e9bca0845b61b35ceb99c5e10018170aef06bbb63ca7e04f7',
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
      state:"todo",
      pkg:"todo"
    },
  });

export const config = networkConfig.testnet
///export const suiClient = new SuiClient({ url: config.url });
export { useNetworkVariable, useNetworkVariables, networkConfig };
