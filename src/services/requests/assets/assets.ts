import api from '@/services/api';
import { IAsset } from '@/types';

export const requestAssets = async (assets: string): Promise<IAsset[]> => {
  const res = await api.get({
    route: `assets/list?asset=${assets}`,
  });
  if (!res || res.error) {
    return [];
  }
  return res.data?.assets || [];
};
