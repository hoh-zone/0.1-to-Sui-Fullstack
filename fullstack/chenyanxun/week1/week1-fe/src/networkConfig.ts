import { createNetworkConfig } from "@mysten/dapp-kit";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const { networkConfig } = createNetworkConfig({
  testnet: {
    url: getFullnodeUrl("testnet"),
    // 视频发布的合约
    packageID:
      "0xe779c13bdddd16241896f15fc56bfa448d6e661b63df5e46be6ef31a063645e4",
    stateObjectID:
      "0xa17ffd9916089dde4fae2e0b24a29ff858a7af787e635ccb7ed77bed5180ad6d",
    // 我发布的合约
    // packageID:
    //   "0x62e13220cb93f8c8c8d684ee68ec7478e96c2ed179cee086a6a34c655575d444",
    // stateObjectID:
    //   "0x2902a480faf17914f1b930f2b9c12704323a9e075f3db31db99f690b4ba491dc",
  },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

// useSuiClientQuery 和 suiClient的区别
const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
});

export { networkConfig, suiClient };
