import { getHost } from '@/services/api';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    if (!req.body) {
      return res.status(400).json({
        data: null,
        error: 'Ivalid body request',
        code: 'invalid_request',
      });
    }

    const { route, service, method, query, body } = req.body;

    if (!route || !service || !method) {
      return res.status(400).json({
        data: null,
        error: 'Required parameters are missing',
        code: 'missing_parameters',
      });
    }

    if (!process.env.DEFAULT_APIKEY_KPRICES) {
      return res.status(500).json({
        data: null,
        error: 'Required environment variable is missing',
        code: 'missing_api_key',
      });
    }

    const request: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'x-apikey': process.env.DEFAULT_APIKEY_KPRICES!,
        Accept: 'application/json',
      },
    };

    if (method === 'POST') {
      request['body'] = JSON.stringify(body);
    }

    const response = await fetch(getHost(route, query, service, 'v2'), request);
    if (!response.ok) {
      res.status(500).json(await response.json());
    } else {
      res.status(200).json(await response.json());
    }
  } catch (error) {
    res.status(500).json({ data: null, error, code: 'internal_error' });
  }
}
