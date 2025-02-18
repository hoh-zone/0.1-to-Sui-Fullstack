import { coinWithBalance, Transaction } from "@mysten/sui/transactions";
import { networkConfig, network } from ".";

const PACKAGE_ID = networkConfig[network].variables.package;

export function createBuyTx(
	poolId: string,
	tokenType: string,
	suiAmount: bigint,
	minTokensOut: bigint,
) {
	const tx = new Transaction();
	const [coin] = tx.splitCoins(tx.gas, [suiAmount]);

	tx.moveCall({
		target: `${PACKAGE_ID}::trade_coin::buy`,
		arguments: [tx.object(poolId), coin, tx.pure.u64(minTokensOut)],
		typeArguments: [tokenType],
	});

	tx.setGasBudget(100000000);
	return tx;
}

export function createSellTx(
	poolId: string,
	tokenType: string,
	amount: bigint,
	minSuiOut: bigint,
  account: string
) {
	const tx = new Transaction();
  tx.setSender(account)

	tx.moveCall({
		target: `${PACKAGE_ID}::trade_coin::sell`,
		arguments: [
			tx.object(poolId),
			tx.object(coinWithBalance({
        balance: amount,
        type: tokenType,
      })),
			tx.pure.u64(minSuiOut),
		],
		typeArguments: [tokenType],
	});

	return tx;
}

export function createPoolTx(
	treasuryCapId: string,
	metadataId: string,
	tokenType: string,
	maxSuiCap: number = 1_000_000_000_000_000,
) {
	const tx = new Transaction();

	tx.moveCall({
		target: `${PACKAGE_ID}::trade_coin::create_pool`,
		arguments: [
			tx.object(treasuryCapId),
			tx.object(metadataId),
			tx.pure.u64(maxSuiCap),
		],
		typeArguments: [tokenType],
	});

	tx.setGasBudget(100000000);

	return tx;
}
