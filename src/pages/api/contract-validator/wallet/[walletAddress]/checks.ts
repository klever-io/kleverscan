import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.DEFAULT_CONTRACT_VALIDATOR_KEY || '';

// Lists a wallet's paid match-checks so the tool can show history and resume
// polling ongoing checks after a reload. The validator never exposes the
// payment tx hash.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { walletAddress } = req.query;
  const validatorUrl = process.env.DEFAULT_CONTRACT_VALIDATOR_URL;

  if (
    typeof walletAddress !== 'string' ||
    !/^klv1[0-9a-z]{58}$/.test(walletAddress)
  ) {
    res.status(400).json({ message: 'Invalid wallet address' });
    return;
  }

  if (!validatorUrl) {
    res.status(500).json({ message: 'Contract validator URL not configured' });
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    let response: Response;
    try {
      response = await fetch(
        `${validatorUrl}/wallet/${encodeURIComponent(walletAddress)}/checks`,
        {
          headers: { 'X-API-KEY': API_KEY },
          signal: controller.signal,
        },
      );
    } finally {
      clearTimeout(timeoutId);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
      return;
    }
    const text = await response.text();
    res.status(response.status).send(text || '');
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      res.status(504).json({ message: 'Upstream validator timeout' });
      return;
    }
    console.error('Contract validator proxy error:', error);
    res.status(502).json({ message: 'Upstream validator request failed' });
  }
}
