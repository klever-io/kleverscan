import { getSomeAssetsPool } from '@/services/requests/pool';
import { ICollectionList } from '@/types';

let poolCache: { [key: string]: any[] } = {};
let poolPaginationCache: {
  [key: string]: { totalPages: number; loadedPages: number };
} = {};

const BACKEND_PAGE_LIMIT = 20;
const MAX_INCREMENTAL_PAGES = 5;

const loadPoolsInBackground = async (
  assets: string,
  cacheKey: string,
  targetPages: number = 2,
): Promise<void> => {
  const startPage = poolPaginationCache[cacheKey].loadedPages + 1;
  const endPage = Math.min(
    startPage + targetPages - 1,
    poolPaginationCache[cacheKey].totalPages || Infinity,
  );

  for (let page = startPage; page <= endPage; page++) {
    try {
      const result = await getSomeAssetsPool(assets, page, BACKEND_PAGE_LIMIT);
      const newPools = result?.data?.pools || [];
      const pagination = result?.pagination;

      poolCache[cacheKey].push(...newPools);
      poolPaginationCache[cacheKey].loadedPages = page;

      if (pagination?.totalPages) {
        poolPaginationCache[cacheKey].totalPages = pagination.totalPages;
      }

      if (!newPools.length || (pagination && page >= pagination.totalPages)) {
        break;
      }
    } catch (error) {
      console.error('Error loading pools in background:', error);
      break;
    }
  }
};

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

  if (!poolCache[cacheKey]) {
    poolCache[cacheKey] = [];
    poolPaginationCache[cacheKey] = { totalPages: 0, loadedPages: 0 };
  }

  if (poolCache[cacheKey].length === 0) {
    try {
      const result = await getSomeAssetsPool(assets, 1, BACKEND_PAGE_LIMIT);
      const newPools = result?.data?.pools || [];
      const pagination = result?.pagination;

      poolCache[cacheKey] = newPools;
      poolPaginationCache[cacheKey].loadedPages = 1;

      if (pagination?.totalPages) {
        poolPaginationCache[cacheKey].totalPages = pagination.totalPages;
      }

      if (pagination && pagination.totalPages > 1) {
        loadPoolsInBackground(assets, cacheKey, 2).catch(console.error);
      }
    } catch (error) {
      console.error('Error fetching initial pools:', error);
    }
  }

  const filteredAssets = assetsList.filter(asset =>
    poolCache[cacheKey].some(
      (assetPool: any) =>
        asset.assetId === assetPool.kda || asset.assetId === 'KLV',
    ),
  );

  // Pagina os resultados filtrados
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedAssets = filteredAssets.slice(startIndex, endIndex);
  const totalFilteredPages = Math.ceil(filteredAssets.length / limit);

  // Se precisamos de mais dados e não temos todos carregados, carrega mais em background
  const needsMoreData =
    paginatedAssets.length < limit &&
    poolPaginationCache[cacheKey].loadedPages <
      poolPaginationCache[cacheKey].totalPages;

  if (needsMoreData) {
    loadPoolsInBackground(assets, cacheKey, 2).catch(console.error);
  }

  // Determina se há mais páginas disponíveis
  const hasMoreBackendPages =
    poolPaginationCache[cacheKey].loadedPages <
    poolPaginationCache[cacheKey].totalPages;
  const hasMoreAssets = page < totalFilteredPages;
  const hasMore = hasMoreAssets || hasMoreBackendPages;

  return {
    filteredAssets: paginatedAssets,
    hasMore,
    totalPages: Math.max(
      totalFilteredPages,
      hasMoreBackendPages ? page + 1 : totalFilteredPages,
    ),
  };
};

export const clearPoolAssetsCache = () => {
  poolCache = {};
  poolPaginationCache = {};
};
