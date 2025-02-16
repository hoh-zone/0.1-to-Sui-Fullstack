import { createNetworkConfig } from '@mysten/dapp-kit'
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client'

const { networkConfig, useNetworkVariable } = createNetworkConfig({
  mainnet: {
    url: getFullnodeUrl('mainnet'),
    variables: {
      packageID: '',
      state: '',
    },
  },
  testnet: {
    url: getFullnodeUrl('testnet'),
    variables: {
      packageID:
        '0x188aee8e56e9917eb46eafc5d99592fd244c324cca6062028fe26c07dae2fed9',
      state:
        '0xddb3f9b68dbf940d69d7f366877715fe635a3d8024dcfd18e1832121f8a16a6b',
    },
  },
})

const suiClient = new SuiClient({
  url: networkConfig.testnet.url,
})

export { networkConfig, useNetworkVariable, suiClient }
