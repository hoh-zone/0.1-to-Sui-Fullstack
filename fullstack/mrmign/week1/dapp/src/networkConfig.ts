import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl("devnet"),
      packageID: "0x4b7b7c0ac2afb8d45215e91e2ecde776f251adfeb50462daa27d6c3fe3dbb8f9",
      state: "0x5b9232dd6324be566306faf217f5cecc4e022e3268410f0e8d64b0a23cc8f527",
    },
    testnet: {
      url: getFullnodeUrl("testnet"),
      packageID: "0xb4b44cae0be3a02b08306124ec71f377f3e14109460153a1aea76404a5b21750",
      state: "0x5c1ce94dc6efab65fe30ac2b2898d0fb2233dc05581529930e51790efbaeae33",
    },
    mainnet: {
      url: getFullnodeUrl("mainnet"),
    },
  });

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
})
export { useNetworkVariable, useNetworkVariables, networkConfig ,suiClient};
