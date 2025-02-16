import WalletContextProvider, {WalletContext} from "@/contexts/walletContext";
import TipContextProvider, {TipContext} from "@/contexts/tipContext";
import NFTContextProvider, {NFTContext} from "@/contexts/nftContext";
import type {NFTContextType} from "@/contexts/nftContext";
import PoolContextProvider, {PoolContext} from "@/contexts/poolContext";
import type {PoolContextType} from "@/contexts/poolContext";

export {
    WalletContext,
    WalletContextProvider,
    TipContext,
    TipContextProvider,
    NFTContext,
    NFTContextProvider,
    PoolContext,
    PoolContextProvider
}
export type {
    NFTContextType,
    PoolContextType
}