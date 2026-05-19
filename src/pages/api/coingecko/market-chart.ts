import { NextApiRequest, NextApiResponse } from 'next';

const COINGECKO_HOST = 'https://api.coingecko.com/api/v3';
const COIN_IDS = {
  KLV: 'klever',
  KFI: 'klever-finance',
} as const;
const ALLOWED_DAYS = ['1', '30', '180'] as const;

type CoinBase = keyof typeof COIN_IDS;
type AllowedDays = (typeof ALLOWED_DAYS)[number];

const getCoinBase = (base: unknown): CoinBase | null => {
  if (typeof base !== 'string') {
    return null;
  }

  const normalizedBase = base.toUpperCase() as CoinBase;

  return normalizedBase in COIN_IDS ? normalizedBase : null;
};

const getDays = (days: unknown): AllowedDays | null => {
  if (typeof days !== 'string') {
    return null;
  }

  return ALLOWED_DAYS.includes(days as AllowedDays)
    ? (days as AllowedDays)
    : null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    return res.status(405).json({
      data: null,
      error: 'Method not allowed',
      code: 'method_not_allowed',
    });
  }

  try {
    const base = getCoinBase(req.query.base);
    const days = getDays(req.query.days || '1');

    if (!base) {
      return res.status(400).json({
        data: null,
        error: 'Invalid coin base',
        code: 'invalid_base',
      });
    }

    if (!days) {
      return res.status(400).json({
        data: null,
        error: 'Invalid chart range',
        code: 'invalid_days',
      });
    }

    const params = new URLSearchParams({
      vs_currency: 'usd',
      days,
    });
    const response = await fetch(
      `${COINGECKO_HOST}/coins/${COIN_IDS[base]}/market_chart?${params}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );

    if (!response.ok) {
      return res.status(502).json({
        data: null,
        error: 'Failed to fetch coin chart',
        code: 'upstream_error',
      });
    }

    return res.status(200).json(await response.json());
  } catch (error) {
    console.error('CoinGecko chart API error:', error);
    return res.status(500).json({
      data: null,
      error: 'Internal server error',
      code: 'internal_error',
    });
  }
}
