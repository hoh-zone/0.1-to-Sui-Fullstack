import { isValidSuiAddress } from "@mysten/sui/utils";
import { suiClient } from "./index";
import { SuiObjectResponse } from "@mysten/sui/client";
import {
	categorizeSuiObjects,
	CategorizedObjects,
} from "@/utils/assetsHelpers";

export const getUserProfile = async (
	address: string,
): Promise<CategorizedObjects> => {
	if (!isValidSuiAddress(address)) {
		throw new Error("Invalid Sui address");
	}

	let hasNextPage = true;
	let nextCursor: string | null = null;
	let allObjects: SuiObjectResponse[] = [];

	while (hasNextPage) {
		const response = await suiClient.getOwnedObjects({
			owner: address,
			options: {
				showContent: true,
			},
			cursor: nextCursor,
		});

		allObjects = allObjects.concat(response.data);
		hasNextPage = response.hasNextPage;
		nextCursor = response.nextCursor ?? null;
	}

	return categorizeSuiObjects(allObjects);
};

export const getSuiBalance = async (address: string): Promise<string> => {
  if (!isValidSuiAddress(address)) {
    throw new Error("Invalid Sui address");
  }

  const balance = await suiClient.getBalance({
    owner: address,
  });

  return balance.totalBalance;
};
