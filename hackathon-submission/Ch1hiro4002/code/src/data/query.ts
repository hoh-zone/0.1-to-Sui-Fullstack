import { suiClient } from "../networkConfig";


// 查询 GiftBag ID
const queryGiftBag = async (userAddress: string) => {
    const giftBag_type = "0xcbfce756649a643c8117b0289eda4c6353a18907d463104947e71775e26f833f::gift::GiftBag";
    if(userAddress) {
        const object_list = await suiClient.getOwnedObjects({ 
            owner: userAddress, 
            filter: { StructType: giftBag_type } 
        });
        const giftBag_id = object_list.data[0]?.data?.objectId;

        if(giftBag_id) {
            return giftBag_id;
        } else {
            return false;
        }
    } else {
        return false;
    }
};

export { queryGiftBag }