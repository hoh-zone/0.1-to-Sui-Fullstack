import { networkConfig } from "../config/networkConfig";
import { Transaction } from "@mysten/sui/transactions";
import { queryState,queryObjs } from '../lib/common';
import { Artwork } from '../lib/constants';



  // export const artworks = await fetchArtworks<Artwork>();

  export const likeArtwork = async (artwork: string, profileId: string) => {
    console.log("likeArtwork", artwork, profileId);
    const tx = new Transaction();
    tx.moveCall({
      package: networkConfig.testnet.packageID,
      module: "artwork",
      function: "like",
      arguments: [
        tx.object(profileId),
        tx.object(artwork),
        tx.splitCoins(tx.gas, [10000000]),
      ],
    });
    return tx;
  };
  
  export const unLikeArtwork = async (artwork: string, profileId: string) => {
    console.log("unLikeArtwork", profileId);
    const tx = new Transaction();
    tx.moveCall({
      package: networkConfig.testnet.packageID,
      module: "artwork",
      function: "cancel_like",
      arguments: [tx.object(profileId), tx.object(artwork)],
    });
    return tx;
  };
  

  export const createArtworkTx = async (
    name: string,
    desc: string,
    content: string,
    model: number,
    profileId: string,
  ) => {
    const tx = new Transaction();
    let date = new Date();
  
    tx.moveCall({
      package: networkConfig.testnet.packageID,
      module: "artwork",
      function: "create_artwork",
      arguments: [
        tx.pure.string(name),
        tx.pure.string(desc),
        tx.pure.string(content),
        tx.pure.u8(model),
        tx.splitCoins(tx.gas, [10000000]),
        tx.pure.string(
          date.toLocaleString("en-US", { timeZone: "America/New_York" }),
        ),
        tx.object(networkConfig.testnet.state),
        tx.object(profileId),
      ],
    });
    return tx;
  };