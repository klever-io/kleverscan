import { getHost } from '@/services/api';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const { route, service, method, query, body } = req.body;

    const response = await fetch(getHost(route, query, service, 'v1.0'), {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      res.status(500).json({});
    } else {
      res.status(200).json(await response.json());
    }
  } catch (error) {
    res.status(500).json({ data: null, error, code: 'internal_error' });
  }
}
