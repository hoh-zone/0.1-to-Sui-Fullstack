import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";

const network = "testnet";

const { networkConfig, useNetworkVariable, useNetworkVariables } =
    createNetworkConfig({
        testnet: {
            url: getFullnodeUrl("testnet"),
            packageID: "0x0b5bada90d38e2763bc74f1d148eac5f1ef21e9e6f876edb1f7d12eefdfe83d0",
            stateID: "0x33d5f58108ce2a764449768e5ed6d74db87ff3ec691bb1e7e72dededf44602e9",
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