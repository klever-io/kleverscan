import api from '@/services/api';
import { IAssetPoolsReponse } from '@/types';

export const getSomeAssetsPool = async (
  assets: string,
): Promise<IAssetPoolsReponse> => {
  const res = await api.get({
    route: `assets/pool/list?asset=${assets}`,
  });

  if (!res.error || res.error === '') {
    return res || [];
  }

  return res.error;
};
