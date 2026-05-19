import { NextApiRequest, NextApiResponse } from 'next';
import { COINGECKO_HOST, COIN_IDS, getCoinBase } from './_shared';

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

    if (!base) {
      return res.status(400).json({
        data: null,
        error: 'Invalid coin base',
        code: 'invalid_base',
      });
    }

    const response = await fetch(`${COINGECKO_HOST}/coins/${COIN_IDS[base]}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      return res.status(502).json({
        data: null,
        error: 'Failed to fetch coin data',
        code: 'upstream_error',
      });
    }

    return res.status(200).json(await response.json());
  } catch (error) {
    console.error('CoinGecko coin API error:', error);
    return res.status(500).json({
      data: null,
      error: 'Internal server error',
      code: 'internal_error',
    });
  }
}
