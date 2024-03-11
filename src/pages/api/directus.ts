import * as directus from '@directus/sdk';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  try {
    const { requestFunction, requestParams } = req.body;

    const client = directus
      .createDirectus(process.env.DEFAULT_CDN_HOST || 'https://cdn.klever.io')
      .with(directus.rest())
      .with(directus.staticToken(process.env.DIRECTUS_STATIC_TOKEN || ''));

    const response = await client.request(
      directus[requestFunction](...requestParams),
    );

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ data: null, error, code: 'internal_error' });
  }
}
