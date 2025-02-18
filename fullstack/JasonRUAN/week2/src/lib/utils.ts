import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatModuleName(name: string) {
    const parts = name.split("::");
    if (parts.length >= 1) {
        const address = parts[0];
        const truncatedAddress = address.length > 8 
            ? `${address.slice(0, 4)}...${address.slice(-4)}`
            : address;
        return [truncatedAddress, ...parts.slice(1)].join("::");
    }
    return name;
}
