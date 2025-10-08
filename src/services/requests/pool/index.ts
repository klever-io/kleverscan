import api from '@/services/api';
import { IAssetPool, IAssetPoolResponse, IAssetPoolsResponse } from '@/types';

export const getSomeAssetsPool = async (
  assets: string,
  page: number = 1,
  limit: number = 10,
): Promise<IAssetPoolsResponse> => {
  const res = await api.get({
    route: `assets/pool/list?asset=${assets}&page=${page}&limit=${limit}`,
  });

  if (!res.error || res.error === '') {
    return res || [];
  }

  return res.error;
};

export const getAssetPool = async (
  assetId: string,
): Promise<IAssetPoolResponse | null> => {
  if (!assetId) return null;
  return await api.get({
    route: `assets/pool/${assetId}`,
  });
};

export const getParsedAssetPool = async (
  assetId: string,
): Promise<IAssetPool | null> => {
  const res = await getAssetPool(assetId);

  if (res && (!res.error || res.error === '')) {
    return res.data.pool;
  }
  return null;
};
