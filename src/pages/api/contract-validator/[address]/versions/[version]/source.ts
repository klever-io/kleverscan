import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { address, version } = req.query;
  const validatorUrl = process.env.CONTRACT_VALIDATOR_URL;

  if (typeof address !== 'string' || !address) {
    res.status(400).json({ message: 'Invalid contract address' });
    return;
  }

  if (typeof version !== 'string' || !version) {
    res.status(400).json({ message: 'Invalid version' });
    return;
  }

  if (!validatorUrl) {
    res.status(500).json({ message: 'Contract validator URL not configured' });
    return;
  }

  try {
    const response = await fetch(
      `${validatorUrl}/contract/${address}/versions/${version}/source`,
    );
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Contract validator proxy error:', error);
    res.status(502).json({ message: 'Upstream validator request failed' });
  }
}
