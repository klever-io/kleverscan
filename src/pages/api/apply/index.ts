import { broadcastTXandCheckStatus } from '@/utils/transaction';
import type { NextApiRequest, NextApiResponse } from 'next';

const API_URL = process.env.KLEVERSCAN_API_URL || '';
const API_KEY = process.env.KLEVERSCAN_API_KEY || '';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> {
  const body = JSON.parse(await req.body);

  const signedTransaction = body.signedTransaction;
  delete body.signedTransaction;

  const errors = [];

  // Broadcast transaction first
  try {
    const { error, status, hash } = await broadcastTXandCheckStatus(
      JSON.parse(signedTransaction),
    );

    if (error || status !== 'success') {
      errors.push('Payment failed.');
      return res.status(400).json({ errors: errors });
    }

    // Create asset info with the hash
    const payload = {
      asset_id: body.id || body.asset_id,
      project_description: body.project_description,
      short_description: body.short_description,
      hash: hash,
    };

    const targetUrl = `${API_URL}/api/v1/asset-info/`;

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      errors.push('Asset Info creation failed.');
      return res.status(400).json({ errors: errors });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    errors.push('An error occurred while processing your request.');
    return res.status(400).json({ errors: errors });
  }
}
