import { getHost } from '@/services/api';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const { route, service, method, query, body } = req.body;

    const request: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    if (method === 'POST') {
      request['body'] = JSON.stringify(body);
    }

    const response = await fetch(
      getHost(route, query, service, 'v1.0'),
      request,
    );
    if (!response.ok) {
      res.status(500).json(await response.json());
    } else {
      res.status(200).json(await response.json());
    }
  } catch (error) {
    res.status(500).json({ data: null, error, code: 'internal_error' });
  }
}
