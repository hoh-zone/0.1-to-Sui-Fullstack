import { client } from '../networkConfig';

interface CoinMetadata {
  id: string;
  decimals: number;
  name: string;
  symbol: string;
}


export async function getCoinMetadata(coinType: string): Promise<CoinMetadata | null> {
  const metadataCache: Record<string, CoinMetadata> = {};
  // 如果缓存中存在，直接返回
  if (metadataCache[coinType]) {
    return metadataCache[coinType];
  }

  try {
    const data = await client.getCoinMetadata({
      coinType: coinType,
    }) as CoinMetadata
    if (!data) return null

    const { decimals, name, symbol, id } = data

    const metadata = {
      id,
      decimals,
      name,
      symbol,
    };

    metadataCache[coinType] = metadata;
    return metadata;
  } catch (error) {
    console.error('Error fetching coin metadata:', error);
    return null;
  }
}

export function formatBalance(balance: string | bigint, decimals: number): string {
  console.log(balance, decimals)
  if (balance === BigInt(0)) return '0';
  
  const balanceString = balance.toString().padStart(decimals + 1, '0');
  const integerPart = balanceString.slice(0, -decimals) || '0';
  const decimalPart = balanceString.slice(-decimals);
  
  // 添加千位分隔符
  const formattedInteger = parseInt(integerPart).toLocaleString();
  
  // 移除末尾的0
  const trimmedDecimal = decimalPart.replace(/0+$/, '');
  
  if (trimmedDecimal) {
    return `${formattedInteger}.${trimmedDecimal}`;
  }
  
  return formattedInteger;
}
