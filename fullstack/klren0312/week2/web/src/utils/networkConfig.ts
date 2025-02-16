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
        packageId: '0x73df46c70baf58c9e90518748cb5659e1bb9a4183fa7499d8ef2223fe866efea',
        server: '0xd67674aa3b05b62277705d8634c1b3b0bb0fa03de4051d405e19d251e52e8aa4'
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
