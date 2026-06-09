import { NextApiRequest, NextApiResponse } from 'next';
import { proxyToValidator } from '@/pages/api/contract-validator/_proxy';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { address, version } = req.query;
  const validatorUrl = process.env.DEFAULT_CONTRACT_VALIDATOR_URL;

  if (typeof address !== 'string' || !address) {
    res.status(400).json({ message: 'Invalid contract address' });
    return;
  }

  if (!/^klv1[0-9a-z]{58}$/.test(address)) {
    res.status(400).json({ message: 'Invalid contract address format' });
    return;
  }

  if (typeof version !== 'string' || !version) {
    res.status(400).json({ message: 'Invalid transaction hash' });
    return;
  }

  if (!/^[0-9a-fA-F]{64}$/.test(version)) {
    res.status(400).json({ message: 'Invalid transaction hash format' });
    return;
  }

  if (!validatorUrl) {
    res.status(500).json({ message: 'Contract validator URL not configured' });
    return;
  }

  const { link, label } = req.body || {};
  if (typeof link !== 'string' || !link.trim()) {
    res.status(400).json({ message: 'Audit link is required' });
    return;
  }
  if (typeof label !== 'string' || !label.trim()) {
    res.status(400).json({ message: 'Audit label is required' });
    return;
  }

  if (link.length > 2048) {
    res.status(400).json({ message: 'Audit link too long (max 2048 chars)' });
    return;
  }

  if (label.length > 255) {
    res.status(400).json({ message: 'Audit label too long (max 255 chars)' });
    return;
  }

  try {
    const { protocol } = new URL(link);
    if (protocol !== 'http:' && protocol !== 'https:') throw new Error();
  } catch {
    res.status(400).json({ message: 'Audit link must use http or https' });
    return;
  }

  await proxyToValidator(
    res,
    `${validatorUrl}/contract/${encodeURIComponent(address)}/versions/${encodeURIComponent(version)}/audits`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link, label }),
    },
  );
}
