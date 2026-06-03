import { NextApiRequest, NextApiResponse } from 'next';
import { proxyToValidator } from '@/pages/api/contract-validator/_proxy';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const validatorUrl = process.env.DEFAULT_CONTRACT_VALIDATOR_URL;
  if (!validatorUrl) {
    res.status(500).json({ message: 'Contract validator URL not configured' });
    return;
  }

  await proxyToValidator(res, `${validatorUrl}/settings`);
}
