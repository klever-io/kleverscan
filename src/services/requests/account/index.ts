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
  IResponse,
  Service,
} from '@/types';
import { formatAmount } from '@/utils/formatFunctions';
import { UINT32_MAX } from '@/utils/globalVariables';
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
      route: `address/${address}`,
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
    const allAccountAssets = await api.get({
      route: `assets/list?page=${page}&limit${limit}&asset=${assetsToRequest}`,
    });
    if (!allAccountAssets.error || allAccountAssets.error === '') {
      assetsArray.forEach((asset: IAccountAsset, index) => {
        const stakingToInsert = allAccountAssets.data.assets.find(
          (asset2: IAccountAsset) => asset2.assetId === asset.assetId,
        );
        if (stakingToInsert) {
          asset.staking = stakingToInsert.staking;
        }
      });
    }

    return {
      data: { assets: assetsArray },
      error: '',
      code: 'successful',
    };
  };

  return get;
};

export const ownedAssetsRequest = (
  address: string,
): ((page: number, limit: number) => Promise<IResponse>) => {
  const get = async (page: number, limit: number): Promise<IResponse> => {
    const ownedAssetsResponse = await api.get({
      route: 'assets/kassets',
      query: { owner: `${address}`, page, limit },
    });

    if (ownedAssetsResponse.error) {
      return {
        data: { assets: null },
        error: 'request failed',
        code: 'error',
      };
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
      route: `address/${address}`,
    });
    if (!accountResponse) return [];

    const assets = accountResponse?.data?.account?.assets || {};
    const assetsBuckets: IAssetsBuckets[] = [];

    const assetsWithBuckets = Object.keys(assets).filter(
      asset => assets[asset]?.buckets?.length,
    );

    const assetsDetailsResponse: IAssetsResponse = await api.get({
      route: `assets/list`,
      query: { asset: assetsWithBuckets, page, limit },
    });

    const allAssetsDetails = assetsDetailsResponse?.data?.assets;

    for (const { assetId, staking } of allAssetsDetails) {
      const asset = assets[assetId];

      if (asset?.staking) asset.staking = staking;

      for (const bucket of asset?.buckets ?? [])
        assetsBuckets.push({ asset, bucket });
    }

    return {
      data: { buckets: assetsBuckets },
      pagination: assetsDetailsResponse.pagination,
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
      route: `address/${router.query.account || ''}`,
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
    const response = await api.post({
      route: 'prices',
      service: Service.KPRICES,
      body: [
        {
          base: 'KLV',
          quote: 'USD',
        },
      ],
      useApiPrice: true,
    });

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
      route: `address/${address}/allowance?assetID=KLV`,
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
      route: `address/${address}/allowance?assetID=KFI`,
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
      route: `address/${address}`,
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
          route: `address/${address}/allowance?assetID=${assetId}`,
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
    return { data: { rewards: responseAll }, code: 'successful', error: '' };
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
      route: `address/${address}`,
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
      page,
      limit,
      sortBy: query?.sortBy || 'totalTransactions',
      orderBy: query?.orderBy || 'desc',
    };

    return await smartContractsTableRequest(page, limit, parsedQuery);
  };

  return get;
};
