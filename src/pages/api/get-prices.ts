import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.DEFAULT_APIKEY_KPRICES;
const KPRICES_HOST =
  process.env.DEFAULT_KPRICES_HOST || 'https://apis.internal.klever.io/kprices';
const API_PORT = process.env.DEFAULT_API_PORT || '';
const ALLOWED_BASES = ['KLV', 'KFI'] as const;

type AllowedBase = (typeof ALLOWED_BASES)[number];

const getKpricesUrl = (): string => {
  const host = KPRICES_HOST.endsWith('/')
    ? KPRICES_HOST.slice(0, -1)
    : KPRICES_HOST;
  const port = API_PORT ? `:${API_PORT}` : '';

  return `${host}${port}/v2/prices`;
};

const getBase = (base: unknown): AllowedBase | null => {
  if (
    typeof base === 'string' &&
    ALLOWED_BASES.includes(base.toUpperCase() as AllowedBase)
  ) {
    return base.toUpperCase() as AllowedBase;
  }

  return null;
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
    const base = getBase(req.query.base);

    if (!base) {
      return res.status(400).json({
        data: null,
        error: 'Invalid base asset',
        code: 'invalid_base',
      });
    }

    if (!API_KEY) {
      return res.status(500).json({
        data: null,
        error: 'Required environment variable is missing',
        code: 'missing_api_key',
      });
    }

    const response = await fetch(getKpricesUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-apikey': API_KEY,
        Accept: 'application/json',
      },
      body: JSON.stringify([{ base, quote: 'USD' }]),
    });

    if (!response.ok) {
      res.status(500).json(await response.json());
    } else {
      res.status(200).json(await response.json());
    }
  } catch (error) {
    res.status(500).json({ data: null, error, code: 'internal_error' });
  }
}
