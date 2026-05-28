import { broadcastTXandCheckStatus } from '@/utils/transaction';
import type { NextApiRequest, NextApiResponse } from 'next';

const VALIDATOR_URL = process.env.DEFAULT_CONTRACT_VALIDATOR_URL || '';
const VALIDATOR_API_KEY = process.env.DEFAULT_CONTRACT_VALIDATOR_KEY || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { address } = req.query;
  if (typeof address !== 'string' || !/^klv1[0-9a-z]{58}$/.test(address)) {
    res.status(400).json({ message: 'Invalid contract address' });
    return;
  }

  if (!VALIDATOR_URL) {
    res.status(500).json({ message: 'Contract validator URL not configured' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  const { signedTransaction, link, label } = body ?? {};

  if (!signedTransaction) {
    res.status(400).json({ message: 'signedTransaction is required' });
    return;
  }
  if (typeof link !== 'string' || !link.trim()) {
    res.status(400).json({ message: 'link is required' });
    return;
  }
  if (typeof label !== 'string' || !label.trim()) {
    res.status(400).json({ message: 'label is required' });
    return;
  }

  const { error, status, hash } = await broadcastTXandCheckStatus(
    JSON.parse(signedTransaction),
  );

  if (error || status !== 'success') {
    return res.status(400).json({ message: 'Payment transaction failed' });
  }

  const response = await fetch(
    `${VALIDATOR_URL}/contract/${encodeURIComponent(address)}/versions/${encodeURIComponent(hash)}/audits`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': VALIDATOR_API_KEY,
      },
      body: JSON.stringify({ link: link.trim(), label: label.trim() }),
    },
  );

  const data = await response.json().catch(() => ({}));
  return res.status(response.status).json(data);
}
