import { useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { queryGiftBag } from "../../../../../data/query.ts"
import { suiClient } from "../../../../../networkConfig"
import { GiftBagObject } from '../../../../../type/type.ts'
import "./Backpack.css";
import { useEffect, useState } from "react";
import { SendGift } from '../../../../../interaction/SendGift'

interface GiftNFT {
    id: any;
    name: string;
    description: string;
    image_url: string;
    data: bigint;
  }


const Backpack = () => {
    const account = useCurrentAccount();
    const userAddress = account?.address;
    const [nfts, setNfts] = useState<GiftNFT[]>([]);
    const [selectedNft, setSelectedNft] = useState<GiftNFT | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTransferDialog, setShowTransferDialog] = useState(false);
    const [recipientAddress, setRecipientAddress] = useState("");
    const {mutate: signAndExecute} = useSignAndExecuteTransaction();


    useEffect(() => {
        const fetchNFTs = async () => {
          try {
            if (!userAddress) return;
            const giftBagID = await queryGiftBag(userAddress);
      
            // 获取礼包对象并类型断言
            const giftBag = await suiClient.getObject({
              id: giftBagID as string,
              options: { showContent: true },
            }) as GiftBagObject;
      
            // 类型安全检查
            if (
              !giftBag.data?.content ||
              giftBag.data.content.dataType !== "moveObject" ||
              !('gifts' in giftBag.data.content.fields)
            ) {
              throw new Error("Invalid gift bag object structure");
            }
      
            const giftAddresses = giftBag.data.content.fields.gifts as string[];
      
            // 获取NFT数据（添加NFT类型断言）
            interface NftContent {
              dataType: "moveObject";
              fields: {
                name: string;
                description: string;
                image_url: string;
                data: string;
              };
            }
      
            const nftPromises = giftAddresses.map(async address => {
              const nft = await suiClient.getObject({
                id: address,
                options: { showContent: true }
              }) as { data?: { content?: NftContent } };
      
              if (
                !nft.data?.content ||
                nft.data.content.dataType !== "moveObject"
              ) {
                throw new Error(`Invalid NFT object at ${address}`);
              }
      
              return {
                id: address,
                name: nft.data.content.fields.name,
                description: nft.data.content.fields.description,
                image_url: nft.data.content.fields.image_url,
                data: BigInt(nft.data.content.fields.data)
              };
            });
      
            const formattedNfts = await Promise.all(nftPromises);
            setNfts(formattedNfts);
      
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load NFTs");
          } finally {
            setLoading(false);
          }
        };
      
        fetchNFTs();
      }, [userAddress, suiClient, nfts]);

      if (loading) return <div className="loading">Loading backpack...</div>;
      if (error) return <div className="error">{error}</div>;

    // 赠送NFT函数
    const handleTransfer = async (gift: any, aiAddress: string) => {
      if (!account?.address) return;
      const giftBag = await queryGiftBag(userAddress as string);
      const tx = await SendGift(
        giftBag,
        gift,
        aiAddress
      );
      signAndExecute({
        transaction: tx
      }, {
        onSuccess: () => {
          setSelectedNft(null);
          setShowTransferDialog(false);
          console.log("Send Gift Success!");
        },
        onError: (error) => {
          console.log(error);
        }
      });


    };

    return (
      <div className='backpack'>
          {/* 显示8个格子 */}
          {[...Array(8)].map((_, index) => {
          const nft = nfts[index];
          return (
              <div 
              key={index}
              className="slot"
              onClick={() => nft && setSelectedNft(nft)}
              >
              {nft ? (
                  <img 
                  src={nft.image_url} 
                  alt={nft.name}
                  className="nft-image"
                  />
              ) : (
                  ``
              )}
              </div>
          );
          })}

          {/* NFT详情弹窗 */}
          {selectedNft && (
          <div className="nft-modal">
              <div className="modal-content">
                <img
                    src={selectedNft.image_url}
                    alt={selectedNft.name}
                    className="modal-image"
                />
              
                <div className="nft-info">
                    <h3>{selectedNft.name}</h3>
                    <p>{selectedNft.description}</p>
                    <div className="affection-data">
                    <span>Favorability：</span>
                    {selectedNft.data.toString()}
                    </div>
                </div>

                <div className="dialog-buttons">
                  <button 
                    className="confirm-button"
                    onClick={() => setShowTransferDialog(true)}
                  >
                     Send
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setSelectedNft(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
          </div>
          )}

          {/* 赠送弹窗 */}
          {showTransferDialog && (
            <div className="transfer-dialog">
              <h3>Give Away {selectedNft?.name}</h3>
              <input
                type="text"
                className="address-input"
                placeholder="Enter the recipient’s wallet address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
              />
              <div className="dialog-buttons">
                <button
                  className="confirm-button"
                  onClick={() => selectedNft && handleTransfer(selectedNft.id, recipientAddress) }
                >
                  Yes
                </button>
                <button
                  className="cancel-button"
                  onClick={() => setShowTransferDialog(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
      </div>


    );
};
    


export default Backpack;