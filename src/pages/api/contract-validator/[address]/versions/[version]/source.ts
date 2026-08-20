import { NextApiRequest, NextApiResponse } from 'next';

const API_KEY = process.env.DEFAULT_CONTRACT_VALIDATOR_KEY || '';

// `.` and `..` survive encodeURIComponent and are then collapsed by URL
// parsing, so an escaped segment alone does not keep the request inside
// /contract/. Rejected here rather than escaped.
const isDotSegment = (value: string): boolean =>
  value === '.' || value === '..';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { address, version } = req.query;
  const validatorUrl = process.env.DEFAULT_CONTRACT_VALIDATOR_URL;

  if (typeof address !== 'string' || !address || isDotSegment(address)) {
    res.status(400).json({ message: 'Invalid contract address' });
    return;
  }

  if (typeof version !== 'string' || !version || isDotSegment(version)) {
    res.status(400).json({ message: 'Invalid version' });
    return;
  }

  if (!validatorUrl) {
    res.status(500).json({ message: 'Contract validator URL not configured' });
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(
      // Escaped because this request carries the API key: unescaped, a `..%2F`
      // in either route param walks out of /contract/ and reaches any GET
      // endpoint of the validator service, answer returned to the caller.
      `${validatorUrl}/contract/${encodeURIComponent(
        address,
      )}/versions/${encodeURIComponent(version)}/source`,
      {
        headers: { 'X-API-KEY': API_KEY },
        signal: controller.signal,
      },
    );
    clearTimeout(timeoutId);

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
