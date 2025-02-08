
import { createBetterTxFactory } from ".";

export const deposit = createBetterTxFactory<{amount: number}>((tx, networkVariables, params) => {
    tx.moveCall({
        package: networkVariables.package,
        module:"demo",
        function:"deposit",
        arguments:[
            tx.pure.u64(params.amount),
        ],
    })
    return tx;
})