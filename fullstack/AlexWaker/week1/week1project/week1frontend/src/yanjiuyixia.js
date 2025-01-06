import { SuiClient } from '@mysten/sui/client';
import { Transaction } from '@mysten/sui/transactions';


const Client = new SuiClient({
  url: 'https://fullnode.testnet.sui.io:443',
});

const tx = new Transaction();
tx.setSender(account.address);
tx.moveCall({
    target: "0x9f78084ec9c0314248abf3c6d53747ad09a2648e371d531db535e6f7f007c624::librarynft::mint",
    arguments: [tx.pure.string("yanjiuyixia"), tx.pure.string("https://pic.imgdb.cn/item/6756fd88d0e0a243d4e0b50d.webp"), tx.pure.string("yanjiuyixia")],
});

const result = Client.signAndExecuteTransaction({
    transaction: tx,
    options: {
        showEvents: true,
    },
});

console.log(result);