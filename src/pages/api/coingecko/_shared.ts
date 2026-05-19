export const COINGECKO_HOST = 'https://api.coingecko.com/api/v3';

export const COIN_IDS = {
  KLV: 'klever',
  KFI: 'klever-finance',
} as const;

export type CoinBase = keyof typeof COIN_IDS;

export const getCoinBase = (base: unknown): CoinBase | null => {
  if (typeof base !== 'string') {
    return null;
  }

  const normalizedBase = base.toUpperCase() as CoinBase;

  return normalizedBase in COIN_IDS ? normalizedBase : null;
};
