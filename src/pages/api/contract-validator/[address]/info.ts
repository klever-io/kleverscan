import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { address } = req.query;
  const validatorUrl = process.env.CONTRACT_VALIDATOR_URL;

  if (!validatorUrl) {
    res.status(500).json({ message: 'Contract validator URL not configured' });
    return;
  }

  try {
    const response = await fetch(`${validatorUrl}/contract/${address}/info`);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Internal error', error: String(error) });
  }
}
