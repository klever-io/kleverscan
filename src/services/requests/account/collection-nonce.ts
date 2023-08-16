import api from '@/services/api';
import { IAsset, IAssetResponse } from '@/types';
import { NextRouter } from 'next/router';

export const requestNonce = async (
  router: NextRouter,
): Promise<IAsset | undefined> => {
  try {
    const res: IAssetResponse = await api.get({
      route: `assets/${router.query.collection}/${router.query.nonce}`,
    });
    if (!res.error || res.error == '') {
      return res.data?.asset;
    }
  } catch (error) {
    console.error(error);
  }
};
