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
    // Through `query`: `assetRef` is whatever was typed into the search box.
    const res = await api.get({
      route: 'assets/list',
      query: { asset: assetRef },
    });

    if (res?.data?.assets?.length)
      result.data = {
        asset: res.data.assets[0],
      };
  }

  return result;
};

export const assetInfoCall = async (router: NextRouter): Promise<any> => {
  try {
    const assetId = router.query?.asset as string;

    const res = await api.assetInfo({
      assetId,
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

/**
 * The proxy answers a missing record with "cannot find ... in database". Its
 * `code` is not dependable for this (a missing KDA pool comes back as
 * `internal_issue`), so the message is what distinguishes a real negative
 * from a transient failure.
 */
const isNotFound = (error?: string): boolean =>
  typeof error === 'string' && error.toLowerCase().includes('cannot find');

export const ITOCall = async (
  assetId: string,
): Promise<IParsedITO | undefined> => {
  const res = await api.get({
    route: `ito/${assetId}`,
    // Most assets have no ITO, and the API answers that with a 404. The
    // request layer retries any error response three times with a pause in
    // between, so a single try keeps a normal negative answer from costing
    // three calls and a second of waiting.
    tries: 1,
  });
  // A transient failure must not read as "this asset has no ITO". Deliberately
  // not wrapped in a try/catch: catching here would return undefined, which
  // the caller turns into a successful empty answer, and the section would
  // stay hidden until the page remounts. String() because a network failure
  // sets `error` to an Error rather than a message.
  if (res.error && !isNotFound(res.error)) {
    throw new Error(String(res.error));
  }
  if (!res.error) {
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
};

export const assetPoolCall = async (
  assetId: string,
): Promise<IAssetPool | undefined> => {
  const res = await api.get({
    route: `assets/pool/${assetId}`,
    // Same as the ITO lookup: an asset without a fee pool is a normal
    // answer, not a failure worth retrying.
    tries: 1,
  });
  // Same reasoning as ITOCall: a swallowed failure would drop the KDA Pool
  // tab as if the asset had no pool.
  if (res.error && !isNotFound(res.error)) {
    throw new Error(String(res.error));
  }
  if (!res.error) {
    const assetPool = res as IAssetPoolResponse;
    return assetPool.data.pool;
  }

  return undefined;
};
