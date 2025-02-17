import { Transaction } from "@mysten/sui/transactions";
import { networkConfig } from "../networkConfig";



export const SendGift = (giftBag: any, gift: any, aiAddress: string) => {
    const packageID = networkConfig.testnet.packageID;

    const tx = new Transaction();
    tx.moveCall({
        package: packageID,
        module: "gift",
        function: "give_away_gift",
        arguments: [
            tx.object(giftBag),
            tx.object(gift),
            tx.pure.address(aiAddress),
        ]
    });

    return tx;
}