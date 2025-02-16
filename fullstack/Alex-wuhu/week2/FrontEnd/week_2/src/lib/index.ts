import { SuiObject } from "@/type";


export const processObject = (objects: SuiObject[]): Record<string, SuiObject[]> => {
    const result: Record<string, SuiObject[]> = {
        'Coin': [],
        'NFT': []
    };
    objects.forEach((object) => {
        if (object.type.includes('0x2::coin::Coin')) {
            object.type = object.type.match(/<(.+)>/)?.[1] || object.type;
            result['Coin'].push(object);
        } else {
            result['NFT'].push(object);
        }
    });
    return result;
}
