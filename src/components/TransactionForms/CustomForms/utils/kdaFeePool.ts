const MIN_DISPLAYABLE_AMOUNT = 1e-8;

export const getKDAFeePoolHelperText = (
  quotient: unknown,
  assetName: string,
): string | undefined => {
  const numericQuotient = Number(quotient);
  const amount = 10 * numericQuotient;

  if (!Number.isFinite(amount) || numericQuotient <= 0) {
    return undefined;
  }

  if (amount > 0 && amount < MIN_DISPLAYABLE_AMOUNT) {
    return `If a fee costs 10 KLV, users will pay < 0.00000001 ${assetName}`;
  }

  const formattedAmount = amount.toLocaleString(undefined, {
    maximumFractionDigits: 8,
  });

  return `If a fee costs 10 KLV, users will pay ${formattedAmount} ${assetName}`;
};
