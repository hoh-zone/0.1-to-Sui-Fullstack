import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const network = "testnet";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
    createNetworkConfig({
        testnet: {
            url: getFullnodeUrl("testnet"),
            packageID: "0x337dc741c1b4b6e57350abca04dc08a23917e5af7d39f7a8ed22ab913378871f",
            stateID: "0x9c60e5ff707b3e2d0026a481bac980d7f21968f2669eda3347cb884191df6dda",
            moduleName: "week2"
        },
    });

const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
});

export { network, useNetworkVariable, useNetworkVariables, networkConfig, suiClient };