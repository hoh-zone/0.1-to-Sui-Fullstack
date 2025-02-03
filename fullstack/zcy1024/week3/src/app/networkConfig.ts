import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";

const network = "testnet";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
    createNetworkConfig({
        testnet: {
            url: getFullnodeUrl("testnet"),
            packageID: "0x00732ff25592c0175ae9a7413017bea39cf0c24ebdaf5978d0e0641b374b74cc",
            stateID: "0x1d86ac608f6efaaa0eb9d44313adc2d4af9459975ef8151d14ff1b705dac0d1e",
            moduleName: "week3"
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