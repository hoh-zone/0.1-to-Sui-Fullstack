import { getFullnodeUrl,SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
const { networkConfig, useNetworkVariable, useNetworkVariables } =
    createNetworkConfig({
        testnet: {
            url: getFullnodeUrl("testnet"),
            packageID: "0x1430a26fd4ea0ab8d24a168617e04d01a27d11f1d211052fbce251872d6aacf4",
            state:"0xd8ad8628afbd72ee933e7547a8fd0588cda562c557149b3d3e507dbe910b1bc1"
        },
    });
const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
})
export { useNetworkVariable, useNetworkVariables, networkConfig,suiClient };
