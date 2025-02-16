import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { createNetworkConfig } from "@mysten/dapp-kit";

type Network = "mainnet" | "testnet" | "devnet" | "localnet";

// const network = (process.env.NEXT_PUBLIC_NETWORK as Network) || "testnet";
const network = "testnet";

const { networkConfig, useNetworkVariable, useNetworkVariables } = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            validator:"0x6d6e9f9d3d81562a0f9b767594286c69c21fea741b1c2303c5b7696d6c63618a"
        },
    },
    mainnet: {
        url: getFullnodeUrl("mainnet"),
        variables: {},
    },
    devnet: {
        url: getFullnodeUrl("devnet"),
        variables: {},
    },
    localnet: {
        url: getFullnodeUrl("localnet"),
        variables: {},
    },
});

// 创建全局 SuiClient 实例
const suiClient = new SuiClient({ url: networkConfig[network].url });

export { useNetworkVariable, useNetworkVariables, networkConfig, network, suiClient };
