import { getSomeAssetsPool } from '@/services/requests/pool';
import { ICollectionList } from '@/types';

let poolCache: { [key: string]: any } = {};
let allFilteredAssetsCache: { [key: string]: ICollectionList[] } = {};

export const filterPoolAssets = async (
  assetsList: ICollectionList[],
  page: number = 1,
  limit: number = 10,
): Promise<{
  filteredAssets: ICollectionList[];
  hasMore: boolean;
  totalPages: number;
}> => {
  const assets = assetsList.map(asset => asset.assetId).join(',');
  const cacheKey = assets;

  if (!allFilteredAssetsCache[cacheKey]) {
    if (!poolCache[cacheKey]) {
      const result = await getSomeAssetsPool(assets, 1, 1000);
      poolCache[cacheKey] = result?.data?.pools || [];
    }

    const assetsPoolArray = poolCache[cacheKey];

    if (assetsPoolArray?.length) {
      allFilteredAssetsCache[cacheKey] = assetsList.filter(asset =>
        assetsPoolArray.some(
          (assetPool: any) =>
            asset.assetId === assetPool.kda || asset.assetId === 'KLV',
        ),
      );
    } else {
      allFilteredAssetsCache[cacheKey] = [];
    }
  }

  const allFilteredAssets = allFilteredAssetsCache[cacheKey];

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedAssets = allFilteredAssets.slice(startIndex, endIndex);
  const totalPages = Math.ceil(allFilteredAssets.length / limit);

  return {
    filteredAssets: paginatedAssets,
    hasMore: page < totalPages,
    totalPages,
  };
};

export const clearPoolAssetsCache = () => {
  poolCache = {};
  allFilteredAssetsCache = {};
};
