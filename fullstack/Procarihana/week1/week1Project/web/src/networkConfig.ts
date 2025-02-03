import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import {createNetworkConfig} from "@mysten/dapp-kit";

const {networkConfig, useNetworkVariable, useNetworkVariables} =
    createNetworkConfig({
        // devnet: {
        //   url: getFullnodeUrl("devnet"),
        // },
        testnet: {
            url: getFullnodeUrl("testnet"),
            packageID: "0xc33dd8ff25cfc78a10f8660a3e9362becf1501cf7c5deb8fd285ed5d28ef4027",
            // owner 为 shared 的 objectID
            state: "0x075f59396a109b6ff11c775c270ee68a334ebc8c133337f5e0acd3ef2b9e42fb"
        },
        // mainnet: {
        //   url: getFullnodeUrl("mainnet"),
        // },
    });

// 通过 suiClient 调用 合约的query 方法
const suiClient = new SuiClient({
    url: networkConfig.testnet.url
})

export {useNetworkVariable, useNetworkVariables, networkConfig, suiClient};
