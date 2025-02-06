import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";

const network = "testnet";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
    createNetworkConfig({
        testnet: {
            url: getFullnodeUrl("testnet"),
            packageID: "0xc79a1f5d3dbf17534fc1417af7bc4ad145b36311b45bed28f356593020d690ec",
            stateID: "0x81166a549caaf09c73053af1f55586d83580b320074321ed75258e31a7796d2a",
            moduleName: "week4"
        },
    });

const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
});

type NetworkVariables = typeof networkConfig.testnet;

function getNetworkVariables() {
    return networkConfig[network];
}

function createBetterTxFactory<T extends Record<string, unknown>>(
    fn: (tx: Transaction, networkVariables: NetworkVariables, params: T) => Transaction
) {
    return (params: T) => {
        const tx = new Transaction();
        const networkVariables = getNetworkVariables();
        return fn(tx, networkVariables, params);
    }
}

export type { NetworkVariables };
export { network, useNetworkVariable, useNetworkVariables, networkConfig, suiClient, createBetterTxFactory };