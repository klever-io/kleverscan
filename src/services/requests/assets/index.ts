import api from '@/services/api';
import { IAsset, IAssetResponse } from '@/types';
import { NextRouter } from 'next/router';

export const requestAssets = async (assets: string): Promise<IAsset[]> => {
  const res = await api.get({
    route: `assets/list?asset=${assets}`,
  });
  if (!res || res.error) {
    return [];
  }
  return res.data?.assets || [];
};

export const requestAssetsQuery = async (
  page: number,
  limit: number,
  router: NextRouter,
): Promise<IAssetResponse> => {
  while (!router.isReady) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const localQuery = { ...router.query, page, limit, hidden: false };
  return api.get({
    route: `assets/list`,
    query: localQuery,
  });
};
