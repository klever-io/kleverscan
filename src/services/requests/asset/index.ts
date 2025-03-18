import api from '@/services/api';
import {
  IAsset,
  IAssetPool,
  IAssetPoolResponse,
  IAssetResponse,
  IHoldersResponse,
  IITOResponse,
  IPagination,
  IParsedITO,
  ITransactionsResponse,
  IUri,
} from '@/types';
import { parseHardCodedInfo, parseITOs } from '@/utils/parseValues';
import {
  addPrecisionsToFPRDeposits,
  getFPRDepositsPrecisions,
} from '@/utils/precisionFunctions';
import { NextRouter } from 'next/router';
import { getSomeAssetsPool } from '../pool';

const parseURIs = (asset: IAsset) => {
  let uris = {};
  if (asset.uris && Object.keys(asset.uris).length > 0) {
    (asset.uris as IUri[]).forEach(uri => {
      uris = {
        ...uris,
        [uri.key]: uri.value,
      };
    });
    asset.uris = uris;
  }
};

export const getAsset = async (assetId: string): Promise<IAssetResponse> =>
  api.get({
    route: `assets/${assetId}`,
  });

export const getAssetByPartialSymbol = async (
  assetRef: string,
): Promise<IAssetResponse> => {
  const result = {
    data: null,
  } as IAssetResponse;

  if (assetRef?.length) {
    const res = await api.get({
      route: `assets/list?asset=${assetRef}`,
    });

    if (res?.data?.assets?.length)
      result.data = {
        asset: res.data.assets[0],
      };
  }
  return result;
};

export const getAssetsByPartialSymbol = async (
  assetRef: string[],
): Promise<IAsset[]> => {
  if (assetRef?.length) {
    const res = await api.get({
      route: `assets/list?asset=${assetRef.join(',')}`,
    });

    if (res?.data?.assets?.length) return res.data.assets;
  }
  return [];
};

export const getAssetsByOwner = async (address: string): Promise<IAsset[]> => {
  if (address?.length) {
    const res = await api.get({
      route: `assets/list?owner=${address}`,
    });

    if (res?.data?.assets?.length) return res.data.assets;
  }
  return [];
};

export const assetInfoCall = async (router: NextRouter): Promise<any> => {
  try {
    const assetId = router.query?.asset as string;

    const res = await api.directus({
      requestFunction: 'readItem',
      requestParams: [
        'asset_info',
        assetId,
        {
          fields: [
            'short_description',
            'project_description',
            'project_description_copy',
          ],
        },
      ],
    });

    return res;
  } catch (error) {
    console.error(error);
  }
};
export const assetCall = async (
  router: NextRouter,
): Promise<IAsset | undefined> => {
  try {
    const assetId = router.query?.asset as string;
    const res = await api.get({
      route: `assets/${assetId}`,
    });

    if (res?.error === 'cannot find asset in database') {
      router.push('/404');
    }
    if (!res.error || res.error === '') {
      const asset = res;
      const parsedAsset = parseHardCodedInfo([asset?.data?.asset])[0];
      parseURIs(parsedAsset);
      if (parsedAsset?.staking?.interestType === 'FPRI') {
        const precisions = await getFPRDepositsPrecisions(parsedAsset);
        addPrecisionsToFPRDeposits(parsedAsset, precisions);
      }
      return parsedAsset;
    }
  } catch (error) {
    console.error(error);
  }
};

export const transactionCall = async (
  assetId: string,
): Promise<IPagination | undefined> => {
  try {
    const res = await api.get({
      route: `transaction/list?asset=${assetId}&limit=5`,
    });
    if (!res.error || res.error === '') {
      const transactions = res as ITransactionsResponse;
      return transactions?.pagination;
    }
  } catch (error) {
    console.error(error);
  }
};

export const transactionCallWithDate = async (
  assetId: string,
  startDate: number,
  endDate: number,
): Promise<IPagination | undefined> => {
  try {
    const res = await api.get({
      route: `transaction/list?asset=${assetId}&startdate=${startDate}&enddate=${endDate}`,
    });
    if (!res.error || res.error === '') {
      const transactions = res as ITransactionsResponse;
      return transactions?.pagination;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getOwnedAssets = async (address: string) => {
  const assets = await getAssetsByOwner(address);
  if (!assets.length) return [];

  const assetIds = assets.map(asset => asset.assetId);

  const assetIdsString = assetIds.join(',');

  const poolData = await getSomeAssetsPool(assetIdsString);

  const poolsByKda = {};

  if (poolData && poolData.data && poolData.data.pools) {
    poolData.data.pools.forEach(pool => {
      poolsByKda[pool.kda] = pool;
    });
  }

  const today = Date.now();
  const yesterday = today - 24 * 60 * 60 * 1000;

  const enhancedAssets = await Promise.all(
    assets.map(async asset => {
      const pagination = await transactionCall(asset.assetId);
      const paginationWithDate = await transactionCallWithDate(
        asset.assetId,
        yesterday,
        today,
      );

      const assetPool = poolsByKda[asset.assetId] || null;

      return {
        ...asset,
        transactionData: pagination || null,
        transactionLastDay: paginationWithDate || null,
        poolData: assetPool,
      };
    }),
  );
  return enhancedAssets;
};

export const holdersCall = async (
  assetId: string,
): Promise<IPagination | undefined> => {
  try {
    const res = await api.get({
      route: `assets/holders/${assetId}`,
    });
    if (!res.error || res.error === '') {
      const holders = res as IHoldersResponse;
      return holders?.pagination;
    }
  } catch (error) {
    console.error(error);
  }
};

export const ITOCall = async (
  assetId: string,
): Promise<IParsedITO | undefined> => {
  try {
    const res = await api.get({
      route: `ito/${assetId}`,
    });
    if (!res.error || res.error === '') {
      const ITOresp = res as IITOResponse;
      if (ITOresp?.data?.ito) {
        const ITO = ITOresp?.data?.ito;

        if (
          !ITO.isActive ||
          (ITO?.endTime && ITO.endTime < Date.now() / 1000) ||
          (ITO?.startTime && ITO.startTime > Date.now() / 1000)
        ) {
          return undefined;
        }

        await parseITOs([ITO]);
        return ITO as IParsedITO;
      }
    }

    return undefined;
  } catch (error) {
    console.error(error);
  }
};

export const assetPoolCall = async (
  assetId: string,
): Promise<IAssetPool | undefined> => {
  try {
    const res = await api.get({
      route: `assets/pool/${assetId}`,
    });
    if (!res.error || res.error === '') {
      const assetPool = res as IAssetPoolResponse;
      return assetPool.data.pool;
    }
  } catch (error) {
    console.error(error);
  }
};
