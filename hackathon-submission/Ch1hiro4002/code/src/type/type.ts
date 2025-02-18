export type GiftBag = {
    gifts: Gift[],
}

export type Gift = {
    gift: string
}



export interface SuiMoveObjectFields {
dataType: "moveObject";
fields: Record<string, any>;
}

export interface GiftBagObject {
data?: {
    content?: SuiMoveObjectFields | { dataType: "package" };
};
}