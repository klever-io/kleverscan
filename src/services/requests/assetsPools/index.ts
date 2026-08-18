import api from '@/services/api';
import {
  IAsset,
  IAssetPool,
  IAssetPoolRow,
  IAssetPoolsResponse,
} from '@/types';
import { NextRouter } from 'next/router';

/**
 * Joins pools with their KDA's asset record. The pool payload has only the
 * asset id, but the KDA balance and the fixed rate are meaningless without
 * that asset's precision, and the identity cell needs its name and logo. One
 * batched lookup per page covers all of it.
 */
const withAssetData = async (pools: IAssetPool[]): Promise<IAssetPoolRow[]> => {
  const ids = Array.from(new Set(pools.map(pool => pool.kda).filter(Boolean)));
  if (ids.length === 0) return pools;

  const response = await api.get({
    route: 'assets/list',
    query: { asset: ids.join(','), limit: ids.length },
  });

  if (response.error) return pools;

  const assets: IAsset[] = response.data?.assets ?? [];
  const assetsById = new Map(
    assets.map(asset => [asset.assetId, asset] as const),
  );

  return pools.map(pool => {
    const asset = assetsById.get(pool.kda);
    return {
      ...pool,
      name: asset?.name,
      logo: asset?.logo,
      ticker: asset?.ticker,
      assetVerified: asset?.verified,
      precision: asset?.precision,
    };
  });
};

export const requestAssetsPoolsQuery = async (
  page: number,
  limit: number,
  router: NextRouter,
): Promise<IAssetPoolsResponse> => {
  while (!router.isReady) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const localQuery = { ...router.query, page, limit, hidden: false };
  const response = await api.get({
    route: `assets/pool/list`,
    query: localQuery,
  });

  // Keep the shape the return type promises even on the error path, so a
  // caller that reads data.pools without checking `error` cannot hit null.
  if (response.error) return { ...response, data: { pools: [] } };

  return {
    ...response,
    data: { pools: await withAssetData(response.data?.pools ?? []) },
  };
};

const POOLS_PER_REQUEST = 100;
/** Bound on the paging loop, so a wrong totalPages cannot stall the tab. */
const MAX_POOL_PAGES = 10;

/**
 * Every pool, for the summary strip and the asset filter. Both present their
 * result as the complete set, so this follows the pagination instead of
 * trusting one page to hold everything.
 */
export const requestAllAssetsPools = async (): Promise<IAssetPool[]> => {
  const pools: IAssetPool[] = [];
  let page = 1;
  let totalPages = 1;

  do {
    const response = await api.get({
      route: 'assets/pool/list',
      query: { page, limit: POOLS_PER_REQUEST, hidden: false },
    });
    if (response.error) throw new Error(response.error);
    const pagePools: IAssetPool[] = response.data?.pools ?? [];
    pools.push(...pagePools);
    totalPages = response.pagination?.totalPages || 1;
    page += 1;
    // Trust the payload over the metadata: a short page means the end.
    if (pagePools.length < POOLS_PER_REQUEST) break;
  } while (page <= Math.min(totalPages, MAX_POOL_PAGES));

  return pools;
};
