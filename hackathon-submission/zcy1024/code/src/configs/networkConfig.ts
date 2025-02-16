import {getFullnodeUrl, SuiClient} from "@mysten/sui/client";
import {createNetworkConfig} from "@mysten/dapp-kit";
import {Transaction} from "@mysten/sui/transactions";

const network = "testnet";

const {networkConfig, useNetworkVariable, useNetworkVariables} = createNetworkConfig({
    testnet: {
        url: getFullnodeUrl("testnet"),
        variables: {
            PackageID: "0x5607706d9e6f7f90b896c43c7e275e53f30d57c4bc5db9bac1bb3659acd63517",
            UpgradeCap: "0xe2202e39196d28db06c4fea3120bbc141d61ba86cb28ec620ab77ee593dc2a94",
            Publisher: "0x6c57845c3d2bd533573fce36e3858b44195b71bddb829082fd8ac1b647fb761e",
            MintedVecSet: "0xd50662a62dd954904dfb6f134966783d5212c565c9911a31a08f47f3c3930170",
            Pool: "0xb38ee85e36d2098c582a5e49012d4d6ba9122b74954178177e8a059d8dd248cf"
        }
    }
});

const suiClient = new SuiClient({
    url: networkConfig[network].url
});

type NetworkVariables = ReturnType<typeof useNetworkVariables>;

function getNetworkVariables() {
    return networkConfig[network].variables;
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

export type {NetworkVariables};
export {
    network,
    useNetworkVariable,
    useNetworkVariables,
    networkConfig,
    suiClient,
    createBetterTxFactory
}