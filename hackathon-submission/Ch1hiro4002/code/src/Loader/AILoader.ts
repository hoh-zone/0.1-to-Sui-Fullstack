import { Eliza } from '@elizaos/core';
import SukiConfig from '../character/Suki.json';

export const createAICharacter = () => {
  const eliza = new Eliza({
    characterConfig: SukiConfig,
    plugins: ['@elizaos/plugin-sui']
  });

  // 注册区块链事件监听
  eliza.useBlockchain({
    network: 'testnet',
    eventCallbacks: {
      'nftReceived': handleNFTEvent
    }
  });

  return eliza;
};

const handleNFTEvent = async (event: any) => {
  console.log('检测到NFT事件:', event);
  // 这里添加好感度处理逻辑
};