import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { MIST_PER_SUI } from "@mysten/sui/utils";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function truncateAddress(address: string): string {
	if (!address) return "";
	return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatAddress(address: string) {
  if (!address) return '';
  
  // 处理包含 :: 的完整代币地址
  if (address.includes('::')) {
    const [packageId, moduleName, name] = address.split('::');
    return `${packageId.slice(0, 6)}...${moduleName}::${name}`;
  }
  
  // 处理普通地址
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const formatBalance = (balance: string, precision = 2) => {
	return (Number.parseInt(balance) / Number(MIST_PER_SUI)).toFixed(precision);
};

export const formatPrice = (price: number) => {
  const priceStr = price.toFixed(20);
  if (priceStr.includes(".")) {
    const firstNonZero = priceStr.match(/[1-9]/);
    if (firstNonZero?.index) {
      return priceStr.slice(0, firstNonZero.index + 4);
    }
  }
  return price.toFixed(2);
};
