import { CoinMetaData } from "@/types";
import { Transaction } from "@mysten/sui/transactions";
import { bcs, fromHex } from "@mysten/bcs";
import * as template from "@mysten/move-bytecode-template";
import { normalizeSuiObjectId } from "@mysten/sui/utils";
import init from "@mysten/move-bytecode-template";

export const BYTECODE =
	"a11ceb0b060000000a01000c020c1e032a21044b0805535707aa01b70108e1026006c1032d0aee03050cf30331000f010b02060210021102120002020001010701000002000c01000102030c01000104040200050507000009000100010e05060100020708090102030c0d01010c040d0a0b00050a03040001040207030c030e02080007080400020b020108000b03010800010a02010805010900010b01010900010800070900020a020a020a020b01010805070804020b030109000b02010900010608040105010b0201080002090005010b030108000c436f696e4d65746164617461064f7074696f6e0854454d504c4154450b5472656173757279436170095478436f6e746578740355726c04636f696e0f6372656174655f63757272656e63790b64756d6d795f6669656c6404696e6974156e65775f756e736166655f66726f6d5f6279746573066f7074696f6e0f7075626c69635f7472616e736665720673656e64657204736f6d650874656d706c617465087472616e736665720a74785f636f6e746578740375726c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000020a02070673796d626f6c0a0205046e616d650a020c0b6465736372697074696f6e0a02090869636f6e5f75726c00020108010000000002170b0031090700070107020703110538000a0138010c020c030b020a012e110438020b030b012e110438030200";

export function editBytecode({
	symbol,
	name,
	description,
	icon_url,
}: CoinMetaData) {
	let updated;
	template.version();

	const updateFunc = (
		code: Uint8Array,
		newVal: string,
		oldVal: string,
		type = "Vector(U8)",
	) => {
		return template.update_constants(
			code,
			bcs.string().serialize(newVal).toBytes(),
			bcs.string().serialize(oldVal).toBytes(),
			type,
		);
	};

	updated = updateFunc(fromHex(BYTECODE), symbol, "symbol");
	updated = updateFunc(updated, name, "name");
	updated = updateFunc(updated, description, "description");
	updated = updateFunc(updated, icon_url, "icon_url");
	updated = template.update_identifiers(updated, {
		TEMPLATE: symbol.toUpperCase(),
		template: symbol.toLowerCase(),
	});

	return template.serialize(template.deserialize(updated));
}

export async function deployTokenTx(sender: string, config: CoinMetaData) {
	await init("/wasm/move_bytecode_template_bg.wasm");

	const tx = new Transaction();
	tx.setGasBudget(100000000);

	const bytecode = editBytecode(config);

	const [treasuryCap] = tx.publish({
		modules: [[...bytecode]],
		dependencies: [normalizeSuiObjectId("0x1"), normalizeSuiObjectId("0x2")],
	});

	tx.setSender(sender);

	tx.transferObjects([treasuryCap], tx.pure.address(sender));

	return tx;
}
