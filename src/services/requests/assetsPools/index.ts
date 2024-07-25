import api from '@/services/api';
import { IAssetPoolResponse } from '@/types';
import { NextRouter } from 'next/router';

export const requestAssetsPoolsQuery = async (
  page: number,
  limit: number,
  router: NextRouter,
): Promise<IAssetPoolResponse> => {
  while (!router.isReady) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const localQuery = { ...router.query, page, limit, hidden: false };
  return api.get({
    route: `assets/pool/list`,
    query: localQuery,
  });
};
