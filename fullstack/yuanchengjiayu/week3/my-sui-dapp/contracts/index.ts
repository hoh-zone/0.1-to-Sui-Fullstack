import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { getContractConfig } from "./config";

type NetworkVariables = ReturnType<typeof useNetworkVariables>;

function getNetworkVariables(network: Network) {
    return networkConfig[network].variables;
}

function createBetterTxFactory<T extends Record<string, unknown>>(
    fn: (tx: Transaction, networkVariables: NetworkVariables, params: T) => Transaction
) {
    return (params: T) => {
        const tx = new Transaction();
        const networkVariables = getNetworkVariables(network);
        return fn(tx, networkVariables, params);
    };
}

type Network = "mainnet" | "testnet"

const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "testnet";

const { networkConfig, useNetworkVariables } = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            package: "0x3c7eba5329c36247ba2b84ecab0979b000a8708c68d5f4a855c65914686d7c5d",
            state: "0xdcdc354f930c2bd043999789212b09627ada81d29099ceff39d2487fd73f3769",
        }
    },
    mainnet: {
        url: getFullnodeUrl("mainnet"), 
        variables: {
            package: "0x7fd729339c08b3792a5864eef329516e49057de2dee36902b25c6eeadd175328",
            state: "0x1a7d3584532d36abde97db832e55d2988c1f498435844c9344c4a1f2e791e3dd",
        }
    }
});

// 创建全局 SuiClient 实例
const suiClient = new SuiClient({ url: networkConfig[network].url });

export { getNetworkVariables, networkConfig, network, suiClient, createBetterTxFactory, useNetworkVariables };
export type { NetworkVariables };

