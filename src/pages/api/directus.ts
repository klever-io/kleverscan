import { queryDirectus } from '@/services/directus';
import * as directus from '@directus/sdk';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const { requestFunction, requestParams } = req.body;

    const client = queryDirectus();

    const response = await client.request(
      directus[requestFunction](...requestParams),
    );

    res.status(200).json(response);
  } catch (error) {
    console.warn('Api Key: ', process.env.DIRECTUS_API_KEY);
    console.error(error);
    res.status(500).json({ data: null, error, code: 'internal_error' });
  }
}
