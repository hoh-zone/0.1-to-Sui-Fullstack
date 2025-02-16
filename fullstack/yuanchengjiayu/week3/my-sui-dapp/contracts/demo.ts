import { createBetterTxFactory } from ".";

export const deposit = createBetterTxFactory<{amount:number}>((tx, networkVariables, params) => {
    tx.moveCall({
        package: networkVariables.package,
        module: "demo",
        function: "deposit",
        arguments: [
            tx.object(networkVariables.state),
            tx.pure.u64(params.amount),
        ],
    })
    return tx;
})