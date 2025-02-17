import { Transaction } from "@mysten/sui/transactions";
import { networkConfig } from "../networkConfig";


export const CreateBag = () => {
    const packageID = networkConfig.testnet.packageID;

    const tx = new Transaction();
    tx.moveCall({
        package: packageID,
        module: "gift",
        function: "create_giftBag",
        arguments: []
    });

    return tx;
}