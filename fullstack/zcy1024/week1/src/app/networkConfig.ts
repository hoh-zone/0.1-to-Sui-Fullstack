import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

const network = "testnet";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
    createNetworkConfig({
        testnet: {
            url: getFullnodeUrl("testnet"),
            packageID: "0xb5ee0ed56bb64bc55128ccae77e9616eb11134a100083283b277e8e3a34055a5",
            stateID: "0x15333dd37f50a8361fd9f839755abc2ddb14a64476ca524c2d12e7cbcc98b4da"
        },
    });

const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
});

export { network, useNetworkVariable, useNetworkVariables, networkConfig, suiClient };