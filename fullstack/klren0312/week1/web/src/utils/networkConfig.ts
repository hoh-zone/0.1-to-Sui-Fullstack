import { getFullnodeUrl } from '@mysten/sui/client'
import { createNetworkConfig } from '@mysten/dapp-kit'

const { networkConfig, useNetworkVariable, useNetworkVariables } =
  createNetworkConfig({
    devnet: {
      url: getFullnodeUrl('devnet'),
      variables: {
        packageId: '0x0',
        server: '0x0'
      },
    },
    testnet: {
      url: getFullnodeUrl('testnet'),
      variables: {
        packageId: '0x485e975299a5d5df56967462a9e585faeb1687ed79b11704ace090b5ac84f5af',
        server: '0x8443d3ada68fd36b894e9e91019f8045ca6bd1f9a8db1ec5d1681c534b54d602'
      },
    },
    mainnet: {
      url: getFullnodeUrl('mainnet'),
      variables: {
        packageId: '0x0',
        server: '0x0'
      },
    },
  })

export { useNetworkVariable, useNetworkVariables, networkConfig }
