import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import {SuiGraphQLClient} from "@mysten/sui/graphql";
import {createNetworkConfig} from "@mysten/dapp-kit";

const {networkConfig, useNetworkVariable, useNetworkVariables} =
    createNetworkConfig({
        // tx:5eVoriatVRYDShNGYgWQ61cipvsg7u4CvyKkyBz1t5CA
        testnet: {
            url: getFullnodeUrl("testnet"),
            packageID: "0x88d15c734b854a80fd016b87832864e496606b38d11330842ab2917f03bab188",
            adoptContracts:"0xd834cb59d06a10d10a272797cd3c70b83d2a517aefe1fc7370baa0853f520bc3",
            //https://testnet.suivision.xyz/validator/0x6d6e9f9d3d81562a0f9b767594286c69c21fea741b1c2303c5b7696d6c63618a
            // 随机找的一个测试网络 validator
            validator:"0x6d6e9f9d3d81562a0f9b767594286c69c21fea741b1c2303c5b7696d6c63618a"
        },
    });
const moudleName = "apply_for_adoption";

const suiClient = new SuiClient({
    url: networkConfig.testnet.url,
});

const suiGraphQLClient = new SuiGraphQLClient({
    url: `https://sui-testnet.mystenlabs.com/graphql`,
});

export {useNetworkVariable, useNetworkVariables, networkConfig, suiClient, suiGraphQLClient,moudleName};
