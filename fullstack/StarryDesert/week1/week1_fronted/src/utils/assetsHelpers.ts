export interface CategorizedObjects {
    coins: Record<string, any[]>;
    objects: Record<string, any[]>;
}

export function categorizeSuiObjects(objects: any[]): CategorizedObjects {
    const categorized: CategorizedObjects = {
        coins: {},
        objects: {}
    };

    objects.forEach((obj) => {
        const type = obj.data?.type;
        if (type && typeof type === 'string') {
            if (type.startsWith('0x2::coin::Coin')) {
                if (!categorized.coins[type]) {
                    categorized.coins[type] = [];
                }
                categorized.coins[type].push(obj);
            } else {
                if (!categorized.objects[type]) {
                    categorized.objects[type] = [];
                }
                categorized.objects[type].push(obj);
            }
        }
    });

    return categorized;
}

export const calculateTotalBalance = (coins: any[]): number => {
    return coins.reduce((total, coin) => {
        const balance = coin.data?.content?.fields?.balance;
        return total + (balance ? Number(balance) : 0);
    }, 0);
};

export const formatBalance = (balance: number): string => {
    return new Intl.NumberFormat('en-US').format(balance);
};
