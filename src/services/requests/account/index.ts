import { IAssetBalance } from '@/components/AccountDetailsModal';
import { IAllowanceResponse } from '@/pages/account/[account]';
import api from '@/services/api';
import {
  IAccount,
  IAccountAsset,
  IAccountResponse,
  IAsset,
  IAssetsBuckets,
  IBucket,
  IResponse,
  ITransaction,
  Service,
} from '@/types';
import { formatAmount } from '@/utils/formatFunctions';
import { UINT32_MAX } from '@/utils/globalVariables';
import { getPrecision } from '@/utils/precisionFunctions';
import { NextRouter } from 'next/router';

interface IQueryParams {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  tab?: string;
  sender?: '' | 'receiver' | 'sender';
}

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
  const requestAssets = async (
    page: number,
    limit: number,
  ): Promise<IResponse> => {
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

    const assets: IAccountAsset[] = accountResponse.data.account.assets;

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
      assetsArray.forEach((asset: IAsset, index) => {
        const stakingToInsert = allAccountAssets.data.assets.find(
          (asset2: IAsset) => asset2.assetId === asset.assetId,
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

  return requestAssets;
};

export const ownedAssetsRequest = (
  address: string,
): ((page: number, limit: number) => Promise<IResponse>) => {
  const requestAssets = async (
    page: number,
    limit: number,
  ): Promise<IResponse> => {
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

  return requestAssets;
};

export const transactionsRequest = (
  address: string,
  query: IQueryParams,
): ((page: number, limit: number) => Promise<IResponse>) => {
  const transactionsRequest = async (page: number, limit: number) => {
    const localQuery: IQueryParams = { ...query, page, limit };
    delete localQuery.tab;
    const transactionsResponse = await api.get({
      route: `address/${address}/transactions`,
      query: localQuery,
    });

    const assets: string[] = [];

    transactionsResponse?.data?.transactions.forEach(
      (transaction: ITransaction) => {
        if (transaction.contract && transaction.contract.length) {
          transaction.contract.forEach(contract => {
            if (contract.parameter === undefined) return;

            if ('assetId' in contract.parameter && contract.parameter.assetId) {
              assets.push(contract.parameter.assetId);
            }
            if (
              'currencyID' in contract.parameter &&
              contract.parameter.currencyID
            ) {
              assets.push(contract.parameter.currencyID);
            }
          });
        }
      },
    );

    const assetPrecisions = await getPrecision(assets);

    const parsedTransactions = transactionsResponse.data?.transactions?.map(
      (transaction: ITransaction) => {
        if (transaction.contract && transaction.contract.length) {
          transaction.contract.forEach(contract => {
            if (contract.parameter === undefined) return;

            if ('assetId' in contract.parameter && contract.parameter.assetId) {
              transaction.precision =
                assetPrecisions[contract.parameter.assetId];
            }
            if (
              'currencyID' in contract.parameter &&
              contract.parameter.currencyID
            ) {
              transaction.precision =
                assetPrecisions[contract.parameter.currencyID];
            }
          });
        }
        return transaction;
      },
    );

    return {
      ...transactionsResponse,
      data: {
        transactions: parsedTransactions,
      },
    };
  };
  return transactionsRequest;
};

export const bucketsRequest = (
  address: string,
): ((page: number, limit: number) => Promise<IResponse | []>) => {
  const requestBuckets = async (
    page: number,
    limit: number,
  ): Promise<IResponse | []> => {
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
          assets[asset]['minEpochsToWithdraw'] =
            details?.data?.asset?.staking?.minEpochsToWithdraw;
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
            bucket['availableEpoch'] = asset['minEpochsToWithdraw']
              ? bucket.unstakedEpoch + asset['minEpochsToWithdraw']
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
    return { data: { buckets: bucketsTable }, code: 'successful', error: '' };
  };
  return requestBuckets;
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
    const res = await api.post({
      route: 'prices/prices',
      service: Service.PROXY,
      body: { names: ['KLV/USD'] },
      useApiProxy: true,
    });
    if (!res.error || res.error === '') {
      return res?.data?.prices?.symbols[0]?.price;
    }
    return Promise.reject(new Error(res?.error));
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
  const requestBuckets = async (
    page: number,
    limit: number,
  ): Promise<IResponse | []> => {
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
          assets[asset]['minEpochsToWithdraw'] =
            details?.data?.asset?.staking?.minEpochsToWithdraw;
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
            bucket['availableEpoch'] = asset['minEpochsToWithdraw']
              ? bucket.unstakedEpoch + asset['minEpochsToWithdraw']
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
      new Set(bucketsTable.map(assetBucket => assetBucket.asset.assetId)),
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
  return requestBuckets;
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
