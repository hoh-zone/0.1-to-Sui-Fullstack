import { Transaction } from "@mysten/sui/transactions";
import { networkConfig, suiClient} from "../networkConfig";
import { GiftBag, Gift } from "../type/type";
import { SUI_DECIMALS } from "@mysten/sui/utils";


export const queryGiftBag = async () => {
    const events = await suiClient.queryEvents({
        query: {
            MoveEventType: `${networkConfig.testnet.packageID}::gift::GiftCreated`
        }
    })

    const giftBag: GiftBag = {
        gifts:[]
    } 
 
    events.data.map((event)=>{
        const gift = event.parsedJson as Gift;
        giftBag.gifts.push(gift);
    })
    return giftBag;
}

export const BuyGift = async(name: string, description: string, image_url: string, data: any, giftBag: any, price: number) => {
    const packageID = networkConfig.testnet.packageID;
    const adjustedAmount = BigInt(
        price * Math.pow(10, SUI_DECIMALS)
    );
    const tx = new Transaction();
    const [coin] = tx.splitCoins(tx.gas, [adjustedAmount]);
    tx.moveCall({
        package: packageID,
        module: "gift",
        function: "create_gift",
        arguments: [
            tx.pure.string(name),
            tx.pure.string(description),
            tx.pure.string(image_url),
            tx.pure.u64(data),
            tx.object(giftBag)
        ]
    });

    tx.transferObjects([coin], "0x8901f128dac4bac3c0324cccade86f5b29329f6cae32a09671476f61a87021db");

    return tx;
}