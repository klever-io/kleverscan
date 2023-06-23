import api from '@/services/api';
import { IAssetResponse } from '@/types';

const getAsset = async (assetId: string): Promise<IAssetResponse> =>
  api.get({
    route: `assets/${assetId}`,
  });

export default getAsset;
