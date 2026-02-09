export const getKDAFeePoolHelperText = (
  quotient: unknown,
  assetName: string,
): string | undefined => {
  const numericQuotient = Number(quotient);
  const amount = 10 * numericQuotient;
  const formattedAmount = Number.isFinite(amount)
    ? amount.toLocaleString(undefined, { maximumFractionDigits: 8 })
    : undefined;

  return numericQuotient > 0 && formattedAmount !== undefined
    ? `If a fee costs 10 KLV, users will pay ${formattedAmount} ${assetName}`
    : undefined;
};
