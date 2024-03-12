import { queryDirectus } from '@/services/directus';
import { broadcastTXandCheckStatus } from '@/utils/transaction';
import { createItem, updateItem } from '@directus/sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<any> {
  const body = JSON.parse(await req.body);

  const unsignedTransaction = body.unsignedTransaction;
  delete body.unsignedTransaction;

  const errors = [];

  const directus = queryDirectus();

  body['payment_status'] = 'not_paid';

  let asset_info;
  try {
    const asset_info_req = await directus.request(
      createItem('asset_info', body),
    );

    asset_info = asset_info_req.id;
  } catch (error: any) {
    if (error?.errors?.[0]?.message.includes('unique')) {
      errors.push(
        'Asset Info already exists. Try connecting your wallet. No money was charged. ',
      );
    } else {
      errors.push('Asset Info creation failed. No money was charged.');
    }
    console.error(error);
    return res.status(400).json({ errors: errors });
  }

  const data = {};

  try {
    const { error, status, hash } = await broadcastTXandCheckStatus(
      JSON.parse(body.signedTransaction),
    );

    if (!error && status === 'success') {
      data['payment_status'] = 'paid';
      data['hash'] = hash;
    } else {
      errors.push('Payment failed.');
      return res.status(400).json({ errors: errors });
    }

    try {
      const response = await directus.request(
        updateItem('asset_info', asset_info, data),
      );

      return res.status(200).json(response);
    } catch (error) {
      errors.push('Asset Info update failed');
      return res.status(400).json({ errors: errors });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ errors: errors });
  }
}
