import BigNumber from "bignumber.js";

export const formatNumber = (
	value: number | string,
	decimals: number = 9,
	significantDigits: number = 6,
): string => {
	const bn = new BigNumber(value);

	if (bn.isZero()) return "0";

	// 移除末尾多余的0
	const formatted = bn.toFormat(decimals);
	const trimmed = formatted.replace(/\.?0+$/, "");

	// 如果数字很小，使用科学计数法
	if (bn.abs().lt(0.000001)) {
		return bn.toExponential(significantDigits);
	}

	return trimmed;
};

export const formatRate = (
	value: number | string,
	decimals: number = 4,
): string => {
	const bn = new BigNumber(value);
	if (bn.isZero()) return "0";
	return bn.toFormat(decimals).replace(/\.?0+$/, "");
};

// export const calculateOutputAmount = (
// 	input: string,
// 	rate: number,
// 	inverse = false,
// ) => {
// 	const amount = Number(input);
// 	if (isNaN(amount)) return "0";
// 	return formatNumber(inverse ? amount / rate : amount * rate);
// };
//
export function calculateOutputAmount(
  inputAmount: string,
  rate: number,
): string {
  if (!inputAmount || isNaN(Number(inputAmount))) return "0";
  
  const amount = parseFloat(inputAmount);
  if (amount <= 0) return "0";

  return (amount * rate).toFixed(9);
}
