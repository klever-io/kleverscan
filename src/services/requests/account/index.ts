import { IAssetBalance } from '@/components/AccountDetailsModal';
import { IAllowanceResponse } from '@/pages/account/[account]';
import api from '@/services/api';
import {
  IAccount,
  IAccountAsset,
  IAccountResponse,
  IAssetsBuckets,
  IAssetsResponse,
  IBucket,
  IPaginatedResponse,
  IProprietaryAsset,
  IResponse,
  IRewardsAssets,
  Service,
} from '@/types';
import { AssetType } from '@/types/assets';
import { formatAmount } from '@/utils/formatFunctions';
import { UINT32_MAX } from '@/utils/globalVariables';
import { NextParsedUrlQuery } from 'next/dist/server/request-meta';
import { NextRouter } from 'next/router';
import { smartContractsTableRequest } from '../smartContracts';

export const generateEmptyAccountResponse = (
  hash: string,
): IAccountResponse => {
  return {
    data: {
      account: {
        address: hash as string,
        nonce: 0,
        balance: 0,
        frozenBalance: 0,
        allowance: 0,
        permissions: [],
        timestamp: new Date().getTime(),
        assets: {},
      },
    },
    pagination: {
      self: 0,
      next: 0,
      previous: 0,
      perPage: 0,
      totalPages: 0,
      totalRecords: 0,
    },
    error: 'cannot find account in database',
    code: 'internal_issue',
  };
};

export const assetsRequest = (
  address: string,
  assetType?: string,
): ((page: number, limit: number) => Promise<IResponse>) => {
  const get = async (page: number, limit: number): Promise<IResponse> => {
    if (!address) {
      return {
        data: { assets: [] },
        error: '',
        code: '',
      };
    }
    const accountResponse = await api.get({
      route: `address/${encodeURIComponent(address)}`,
    });
    if (accountResponse.error) {
      return {
        data: { assets: null },
        error: 'request failed',
        code: 'error',
      };
    }

    const assets: { [key: string]: IAccountAsset } =
      accountResponse.data.account.assets;

    if (!Object.keys(assets).length) {
      return {
        data: { assets: null },
        error: 'request failed',
        code: 'error',
      };
    }
    let assetsToRequest = '';
    const assetsArray = Object.keys(assets).map(asset => {
      assetsToRequest += `${assets[asset].assetId},`;
      return assets[asset];
    });

    assetsToRequest = assetsToRequest.slice(0, -1);
    // The table draws every holding from this one response, so the detail
    // lookup has to cover the whole set. The table page only filled staking
    // for the first slice of ids, and the same slice is where the logo lives.
    const allAccountAssets = await api.get({
      route: 'assets/list',
      query: {
        page: 1,
        limit: assetsArray.length,
        asset: assetsToRequest,
      },
    });
    const listed: Array<IAccountAsset & { name?: string }> = Array.isArray(
      allAccountAssets.data?.assets,
    )
      ? allAccountAssets.data.assets
      : [];
    if (!allAccountAssets.error || allAccountAssets.error === '') {
      const byId = new Map(listed.map(item => [item.assetId, item]));
      assetsArray.forEach((asset: IAccountAsset) => {
        const details = byId.get(asset.assetId);
        if (!details) return;
        asset.staking = details.staking;
        asset.logo = details.logo;
        asset.ticker = details.ticker;
        asset.verified = details.verified;
        if (details.name) asset.assetName = details.name;
      });
    }

    // Filter by asset type if specified
    let filteredAssets = assetsArray;
    if (assetType) {
      const typeMap: { [key: string]: number } = {
        Fungible: AssetType.Fungible,
        NonFungible: AssetType.NonFungible,
        SemiFungible: AssetType.SemiFungible,
      };
      const typeValue = typeMap[assetType];
      if (typeValue !== undefined) {
        filteredAssets = assetsArray.filter(
          asset => asset.assetType === typeValue,
        );
      }
    }

    return {
      data: { assets: filteredAssets },
      error: '',
      code: 'successful',
    };
  };

  return get;
};

export const ownedAssetsRequest = (
  address: string,
  assetType?: string,
): ((page: number, limit: number) => Promise<IResponse>) => {
  const get = async (page: number, limit: number): Promise<IResponse> => {
    let query: Record<string, any> = {
      owner: `${address}`,
      page,
      limit,
    };

    if (assetType) {
      query = {
        ...query,
        type: assetType,
      };
    }
    const ownedAssetsResponse = await api.get({
      route: 'assets/kassets',
      query,
    });

    if (ownedAssetsResponse.error) {
      return {
        data: { assets: null },
        error: 'request failed',
        code: 'error',
      };
    }
    const owned = Array.isArray(ownedAssetsResponse.data?.assets)
      ? ownedAssetsResponse.data.assets
      : [];
    // kassets can carry a broken logo (the string "https/"). The registry
    // list is the same source the holdings table uses.
    if (owned.length) {
      const listed = await api.get({
        route: 'assets/list',
        query: {
          asset: owned
            .map((item: { assetId: string }) => item.assetId)
            .join(','),
          page: 1,
          limit: owned.length,
        },
      });
      const byId = new Map(
        (Array.isArray(listed.data?.assets) ? listed.data.assets : []).map(
          (item: { assetId: string }) => [item.assetId, item],
        ),
      );
      owned.forEach((asset: IProprietaryAsset) => {
        const details = byId.get(asset.assetId) as
          | {
              logo?: string;
              ticker?: string;
              name?: string;
              verified?: boolean;
            }
          | undefined;
        if (!details) return;
        if (details.logo) asset.logo = details.logo;
        if (details.ticker) asset.ticker = details.ticker;
        if (details.name) asset.name = details.name;
        if (typeof details.verified === 'boolean') {
          asset.verified = details.verified;
        }
      });
    }
    const proprietaryAssets = {
      data: {
        proprietaryAssets: ownedAssetsResponse.data.assets,
      },
      error: '',
      code: 'successful',
      pagination: ownedAssetsResponse.pagination,
    };
    return proprietaryAssets;
  };

  return get;
};

export const bucketsRequest = (
  address: string,
): ((page: number, limit: number) => Promise<IResponse | []>) => {
  const get = async (
    page: number,
    limit: number,
  ): Promise<IPaginatedResponse | []> => {
    const accountResponse: IAccountResponse = await api.get({
      route: `address/${encodeURIComponent(address)}`,
    });
    if (!accountResponse) return [];

    const assets = accountResponse?.data?.account?.assets || {};
    const assetsBuckets: IAssetsBuckets[] = [];

    const assetsWithBuckets = Object.keys(assets).filter(
      asset => assets[asset]?.buckets?.length,
    );

    if (assetsWithBuckets.length === 0) {
      return {
        data: { buckets: [] },
        code: 'successful',
        error: '',
      };
    }

    const assetsDetailsResponse: IAssetsResponse = await api.get({
      route: `assets/list`,
      query: {
        asset: assetsWithBuckets.join(','),
        page: 1,
        limit: assetsWithBuckets.length,
      },
    });

    const allAssetsDetails = Array.isArray(assetsDetailsResponse?.data?.assets)
      ? assetsDetailsResponse.data.assets
      : [];
    const returnedIds = new Set<string>();

    for (const details of allAssetsDetails) {
      const asset = assets[details.assetId];
      if (!asset) continue;
      returnedIds.add(details.assetId);

      if (asset.staking) asset.staking = details.staking;
      asset.logo = details.logo;
      asset.ticker = details.ticker;
      asset.verified = details.verified;
      if (details.name) asset.assetName = details.name;

      for (const bucket of asset.buckets ?? [])
        assetsBuckets.push({ asset, bucket });
    }

    // A failed or partial registry list must not hide stakes. Holdings and
    // rewards already keep their rows without a logo. Buckets used to return
    // an empty list instead, because rows were built only from the list.
    for (const assetId of assetsWithBuckets) {
      if (returnedIds.has(assetId)) continue;
      // The id list above only keeps assets that already have buckets.
      const asset = assets[assetId];
      const buckets = asset.buckets as IBucket[];
      for (const bucket of buckets) {
        assetsBuckets.push({ asset, bucket });
      }
    }

    const uniqueDelegations = Array.from(
      new Set(
        assetsBuckets
          .map(ab => ab.bucket?.delegation)
          .filter((d): d is string => !!d && d.length > 0),
      ),
    );

    const statusMap = new Map<string, string>();

    if (uniqueDelegations.length > 0) {
      if (uniqueDelegations.length <= 3) {
        const results = await Promise.all(
          uniqueDelegations.map(addr =>
            api.get({ route: `validator/${addr}` }).catch(() => null),
          ),
        );
        for (let i = 0; i < uniqueDelegations.length; i++) {
          const res = results[i];
          if (res && !res.error) {
            statusMap.set(
              uniqueDelegations[i],
              res.data?.validator?.list || '',
            );
          }
        }
      } else {
        const firstPage = await api
          .get({ route: 'validator/list', query: { page: 1, limit: 100 } })
          .catch(() => null);
        if (firstPage && !firstPage.error) {
          const totalPages = Math.ceil(
            (firstPage.pagination?.totalRecords || 0) / 100,
          );
          const allPages = [firstPage];
          if (totalPages > 1) {
            const rest = await Promise.all(
              Array.from({ length: totalPages - 1 }, (_, i) =>
                api
                  .get({
                    route: 'validator/list',
                    query: { page: i + 2, limit: 100 },
                  })
                  .catch(() => null),
              ),
            );
            allPages.push(...rest.filter(Boolean));
          }
          for (const p of allPages) {
            for (const v of p?.data?.validators ?? []) {
              if (v.ownerAddress) {
                statusMap.set(v.ownerAddress, v.list || '');
              }
            }
          }
        }
      }
    }

    for (const ab of assetsBuckets) {
      if (ab.bucket?.delegation) {
        ab.validatorStatus = statusMap.get(ab.bucket.delegation) || '';
      }
    }

    // The registry call loads a logo for every stake. The table still pages
    // the bucket rows themselves. Passing the registry pagination through
    // made every page repeat the full set.
    const safeLimit = limit > 0 ? limit : 10;
    const safePage = page > 0 ? page : 1;
    const totalRecords = assetsBuckets.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / safeLimit));
    const start = (safePage - 1) * safeLimit;

    return {
      data: { buckets: assetsBuckets.slice(start, start + safeLimit) },
      pagination: {
        self: safePage,
        next: safePage < totalPages ? safePage + 1 : 0,
        previous: safePage > 1 ? safePage - 1 : 0,
        perPage: safeLimit,
        totalPages,
        totalRecords,
      },
      code: 'successful',
      error: '',
    };
  };

  return get;
};

export const accountCall = async (
  router: NextRouter,
): Promise<IAccount | undefined> => {
  try {
    const res = await api.get({
      route: `address/${encodeURIComponent(String(router.query.account || ''))}`,
    });
    if (!res.error || res.error === '') {
      return res.data.account;
    }
    if (res.error === 'cannot find account in database') {
      const emptyAccount = generateEmptyAccountResponse(
        router.query.account as string,
      );
      return emptyAccount.data.account;
    }
    if (res.error.includes('could not create address from provided param')) {
      router.push('/404');
    }
    return Promise.reject(new Error(res?.error));
  } catch (error) {
    console.error(error);
  }
};

export const pricesCall = async (): Promise<number | undefined> => {
  try {
    const response = await api.price({ base: 'KLV' });

    if (!response.error || response.error === '') {
      return response[0]?.price_usd;
    }

    return Promise.reject(new Error(response?.error));
  } catch (error) {
    console.error(error);
  }
};

export const KLVAllowancePromise = async (
  address: string,
): Promise<IAllowanceResponse | undefined> => {
  try {
    const res = await api.get({
      route: `address/${encodeURIComponent(address)}/allowance`,
      query: { assetID: 'KLV' },
      service: Service.PROXY,
    });
    if (!res.error || res.error === '') {
      return res;
    }
    return Promise.reject(new Error(res?.error));
  } catch (error) {
    console.error(error);
  }
};

export const KFIAllowancePromise = async (
  address: string,
): Promise<IAllowanceResponse | undefined> => {
  try {
    const res = await api.get({
      route: `address/${encodeURIComponent(address)}/allowance`,
      query: { assetID: 'KFI' },
      service: Service.PROXY,
    });
    if (!res.error || res.error === '') {
      return res;
    }
    return Promise.reject(new Error(res?.error));
  } catch (error) {
    console.error(error);
  }
};

export const accountAssetsOwnerCall = async (
  address: string,
): Promise<boolean | undefined> => {
  try {
    const res = await api.get({
      route: 'assets/list',
      query: { owner: `${address}` },
    });
    if (!res.error || res.error === '') {
      return res.data.assets.length > 0;
    }
    return Promise.reject(new Error(res?.error));
  } catch (error) {
    console.error(error);
  }
};

export const rewardsFPRPool = (
  address: string,
): ((page: number, limit: number) => Promise<IResponse | []>) => {
  const get = async (page: number, limit: number): Promise<IResponse | []> => {
    const accountResponse: IAccountResponse = await api.get({
      route: `address/${encodeURIComponent(address)}`,
    });
    if (!accountResponse) return [];
    const bucketsTable: IAssetsBuckets[] = [];
    const assets = accountResponse?.data?.account?.assets || {};
    Object.keys(assets).forEach(asset => {
      const assetHasUnstakedBucket = assets[asset]?.buckets?.find(
        (bucket: IBucket) => bucket.unstakedEpoch !== UINT32_MAX,
      );

      const getDetails = async () => {
        const details = await api.get({
          route: `assets/${assets[asset]?.assetId}`,
        });
        if (details.error === '') {
          assets[asset].staking = details?.data?.asset?.staking;
        }
      };

      if (assetHasUnstakedBucket) {
        getDetails();
      }
      if (assets?.[asset]?.buckets?.length) {
        assets?.[asset].buckets?.forEach((bucket: IBucket) => {
          if (
            bucket.unstakedEpoch === UINT32_MAX &&
            assets?.[asset].assetId.length < 64
          ) {
            bucket['availableEpoch'] = assets?.[asset].staking
              ?.minEpochsToWithdraw
              ? bucket.unstakedEpoch +
                assets?.[asset].staking.minEpochsToWithdraw
              : '--';
          } else {
            bucket['availableEpoch'] = bucket.unstakedEpoch + 2; // Default for KLV and KFI
          }
          const assetBucket = {
            asset: { ...assets[asset] },
            bucket: { ...bucket },
          };
          bucketsTable.push(assetBucket);
        });
      }
    });
    const assetIdBuckets = Array.from(
      new Set(bucketsTable.map(assetBucket => assetBucket.asset?.assetId)),
    );
    const responseAll = await Promise.all(
      assetIdBuckets.map(async assetId => {
        const res = await api.get({
          route: `address/${encodeURIComponent(address)}/allowance`,
          query: { assetID: assetId },
        });
        if (!res.error || res.error === '') {
          return {
            allowance: res.data.result.allowance,
            allStakingRewards: res.data.result.allStakingRewards,
            assetId,
          };
        }
      }),
    );
    const rewards: IRewardsAssets[] = [];
    responseAll.forEach(row => {
      if (!row?.assetId) return;
      rewards.push({
        allowance: row.allowance,
        allStakingRewards: row.allStakingRewards,
        assetId: row.assetId,
      });
    });
    if (rewards.length) {
      const listed = await api.get({
        route: 'assets/list',
        query: {
          asset: rewards.map(row => row.assetId).join(','),
          page: 1,
          limit: rewards.length,
        },
      });
      const byId = new Map(
        (Array.isArray(listed.data?.assets) ? listed.data.assets : []).map(
          (item: { assetId: string }) => [item.assetId, item],
        ),
      );
      rewards.forEach(row => {
        const details = byId.get(row.assetId) as
          | {
              logo?: string;
              ticker?: string;
              name?: string;
              verified?: boolean;
            }
          | undefined;
        if (!details) return;
        row.logo = details.logo;
        row.ticker = details.ticker;
        row.assetName = details.name;
        row.verified = details.verified;
      });
    }
    return { data: { rewards }, code: 'successful', error: '' };
  };

  return get;
};

export const myAccountCall = async (
  walletAddress: string,
): Promise<IAccount | undefined> => {
  try {
    const res = await api.get({
      route: `address/${walletAddress || ''}`,
    });
    if (!res.error || res.error === '') {
      return res.data.account;
    }
    if (res.error === 'cannot find account in database') {
      const emptyAccount = generateEmptyAccountResponse(
        walletAddress as string,
      );
      return emptyAccount.data.account;
    }
    return Promise.reject(new Error(res?.error));
  } catch (error) {
    console.error(error);
  }
};

export interface IAccountBalance {
  otherAssets: IAssetBalance[];
  balance: { klv: string };
}

export const getAccountBalanceRequest = async (
  walletAddress: string,
  setLoadingBalance: React.Dispatch<React.SetStateAction<boolean>>,
): Promise<IAccountBalance> => {
  if (!walletAddress) {
    // Return a default value or throw an error if walletAddress is not provided
    throw new Error('Wallet address is required');
  }
  setLoadingBalance(true); // setLoadingBalance might not be necessary with React Query
  const res: IAccountResponse = await api.get({
    route: `address/${walletAddress}`,
  });
  if (res.error) {
    if (res.error === 'cannot find account in database') {
      // Handle error or return default value
      return {
        otherAssets: [{ assetId: 'KLV', balance: '0' }],
        balance: { klv: '0' },
      };
    }
    throw new Error(res.error.toString());
  }

  const klvAvailableBalance = res?.data?.account?.balance;
  const accountAssets = res?.data?.account.assets;
  const otherAssets: IAssetBalance[] = accountAssets
    ? Object.values(accountAssets).map(asset => ({
        assetId: asset.assetId,
        balance: formatAmount(asset.balance / 10 ** asset.precision),
      }))
    : [];

  const balance =
    typeof klvAvailableBalance === 'number'
      ? { klv: formatAmount(klvAvailableBalance / 10 ** 6) }
      : { klv: '0' };

  return { otherAssets, balance };
};

export const nftCollectionsRequest = (
  address: string,
): ((page: number, limit: number) => Promise<IResponse>) => {
  const get = async (page: number, limit: number): Promise<IResponse> => {
    if (!address) {
      return {
        data: { assets: [] },
        error: '',
        code: '',
      };
    }

    const res = await api.get({
      route: `address/${encodeURIComponent(address)}`,
    });

    if (res.error && res.error !== '') {
      return {
        data: { assets: [] },
        error: res.error,
        code: 'error',
      };
    }

    const assets = res.data.account.assets as { [key: string]: IAccountAsset };
    const nftCollections = Object.values(assets).filter(
      (asset: IAccountAsset) => asset.assetType === 1,
    );

    return {
      data: { assets: nftCollections },
      code: 'successful',
      error: '',
    };
  };

  return get;
};

export const getSCDeployedByAddress = (address: string, query: any) => {
  const get = async (
    page: number,
    limit: number,
  ): Promise<IPaginatedResponse> => {
    const parsedQuery = {
      deployer: address,
      sortBy: query?.sortBy || 'totalTransactions',
      orderBy: query?.orderBy || 'desc',
    } as unknown as NextParsedUrlQuery;

    return await smartContractsTableRequest(page, limit, parsedQuery);
  };

  return get;
};
