import api from '@/services/api';
import {
  IBuyCardResponse,
  IMarketplaceResponse,
  IMarketplacesResponse,
} from '@/types/marketplaces';
import { requestAssets } from '../assets';

export const getMarketplaces = async (): Promise<IMarketplacesResponse> => {
  const res: IMarketplacesResponse = await api.get({
    route: 'marketplaces/list',
  });
  return res;
};

export const getMarketplace = async (
  marketplaceId: string,
  page: number,
): Promise<IMarketplaceResponse> => {
  const res: IMarketplaceResponse = await api.get({
    route: `marketplaces/${marketplaceId}?page=${page}`,
  });
  return res;
};

export const getBuyCards = async (
  marketplaceId: string,
  page: number,
): Promise<IBuyCardResponse | null> => {
  const marketplaceResponse = await getMarketplace(marketplaceId, page);

  if (marketplaceResponse.data || marketplaceResponse.error === '') {
    const assetsKeys = Object.keys(
      marketplaceResponse.data.assets.assets || [],
    );

    const sanitizedAssetKeys = assetsKeys
      .map(item => {
        const parts = item.split('/');
        return parts[0];
      })
      .join(',');

    const assets = await requestAssets(sanitizedAssetKeys);
    if (assets) {
      return {
        marketplaceResponse,
        assets,
      };
    }
  }
  return null;
};
