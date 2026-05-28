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

  let body: unknown;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    res.status(400).json({ message: 'Invalid request body' });
    return;
  }

  const { signedTransaction, link, label, versionTxHash } =
    (body as Record<string, unknown>) ?? {};

  if (typeof signedTransaction !== 'string' || !signedTransaction) {
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
  if (
    typeof versionTxHash !== 'string' ||
    !/^[0-9a-fA-F]{64}$/.test(versionTxHash)
  ) {
    res
      .status(400)
      .json({
        message:
          'versionTxHash is required and must be a valid 64-hex transaction hash',
      });
    return;
  }

  let parsedTx: unknown;
  try {
    parsedTx = JSON.parse(signedTransaction);
  } catch {
    res.status(400).json({ message: 'signedTransaction is not valid JSON' });
    return;
  }

  const { error, status, hash } = await broadcastTXandCheckStatus(
    parsedTx as Parameters<typeof broadcastTXandCheckStatus>[0],
  );

  if (error || status !== 'success') {
    return res.status(400).json({ message: 'Payment transaction failed' });
  }

  const response = await fetch(
    `${VALIDATOR_URL}/contract/${encodeURIComponent(address)}/versions/${encodeURIComponent(versionTxHash)}/audits`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': VALIDATOR_API_KEY,
      },
      body: JSON.stringify({
        link: link.trim(),
        label: label.trim(),
        payment_tx_hash: hash,
      }),
    },
  );

  const data = await response.json().catch(() => ({}));
  return res.status(response.status).json(data);
}
