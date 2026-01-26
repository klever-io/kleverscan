import api from '@/services/api';
import {
  IAsset,
  IFPR,
  IKDAFPR,
  IPrecisionResponse,
  ITransaction,
  Service,
} from '@/types';
import { toast } from 'react-toastify';
import { KLV_PRECISION } from '../globalVariables';
import {
  getAssetsAndCurrenciesList,
  getTransactionPrecision,
} from '@/pages/transactions';

export function getPrecision<T extends string | string[]>(
  assetIds: T,
): T extends string ? Promise<number> : Promise<{ [assetId: string]: number }>;

export async function getPrecision(
  assetIds: string | string[],
): Promise<number | { [assetId: string]: number }> {
  const parsedAssetIds = Array.isArray(assetIds)
    ? assetIds.map(assetId => assetId.split('/')[0])
    : assetIds.split('/')[0];

  const storedPrecisions: any = localStorage.getItem('precisions')
    ? JSON.parse(localStorage.getItem('precisions') || '{}')
    : {};

  if (
    typeof parsedAssetIds === 'object' &&
    parsedAssetIds.length !== undefined
  ) {
    if (parsedAssetIds.length === 0) {
      return {};
    }
    const assetsToFetch: string[] = [];

    parsedAssetIds.forEach(assetId => {
      if (
        !Object.keys(storedPrecisions)
          .filter(key => storedPrecisions[key] !== undefined)
          .includes(assetId) &&
        assetId !== '' &&
        !assetsToFetch.includes(assetId)
      ) {
        assetsToFetch.push(assetId);
      }
    });

    if (assetsToFetch.length === 0) {
      return parsedAssetIds.reduce((prev, current) => {
        return {
          ...prev,
          [current]: storedPrecisions[current],
        };
      }, {});
    }

    const precisions = (await getPrecisionFromApi(assetsToFetch))?.precisions;
    const newPrecisions = { ...storedPrecisions, ...precisions };
    localStorage.setItem('precisions', JSON.stringify(newPrecisions));
    return parsedAssetIds.reduce((prev, current) => {
      return {
        ...prev,
        [current]: newPrecisions[current],
      };
    }, {});
  } else if (typeof parsedAssetIds === 'string') {
    if (parsedAssetIds === '') {
      throw new Error('Empty Asset ID');
    }

    if (
      !storedPrecisions ||
      !Object.keys(storedPrecisions)
        .filter(key => storedPrecisions[key] !== undefined)
        .includes(parsedAssetIds)
    ) {
      const precisions = (await getPrecisionFromApi([parsedAssetIds]))
        ?.precisions;
      const newPrecisions = { ...storedPrecisions, ...precisions };
      localStorage.setItem('precisions', JSON.stringify(newPrecisions));
      return precisions[parsedAssetIds];
    } else {
      return storedPrecisions[parsedAssetIds];
    }
  } else {
    throw new Error('Invalid assetId');
  }
}

/**
 * Get an asset's precision and use it as an exponent to the base 10, the result is returned. In case of error returns undefined and a toast error.
 * @param asset
 * @returns Promise < number | undefined >
 */
export const getPrecisionFromApi = async (
  assets: string[],
): Promise<IPrecisionResponse> => {
  try {
    const response = await api.post({
      route: `assets/precisions`,
      service: Service.PROXY,
      query: {
        limit: 100,
      },
      body: { assets },
      tries: 10,
    });
    if (response.error) {
      const messageError =
        response.error.charAt(0).toUpperCase() + response.error.slice(1);
      toast.error(messageError, { toastId: 'Fetch timeout' });
      throw new Error(response.error);
    }

    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const getFPRDepositsPrecisions = async (
  asset: IAsset,
): Promise<{ [assetId: string]: number }> => {
  const assetsToSearch: string[] = [];
  asset.staking.fpr.forEach((data: IFPR) => {
    data.kda.forEach((kda: IKDAFPR) => {
      assetsToSearch.push(kda.kda);
    });
  });
  return getPrecision(assetsToSearch);
};

export const addPrecisionsToFPRDeposits = (
  asset: IAsset,
  precisions: { [assetId: string]: number },
): any => {
  asset.staking.fpr.forEach((data: IFPR) => {
    data.totalAmount = data.totalAmount / 10 ** KLV_PRECISION;
    data.TotalClaimed = data.TotalClaimed / 10 ** KLV_PRECISION;
    data.totalStaked = data.totalStaked / 10 ** asset.precision;
    data.precision = asset.precision;
    data.kda.forEach((kda: IKDAFPR) => {
      let precision = 0;
      Object.entries(precisions).forEach(([assetTicker, assetPrecision]) => {
        if (assetTicker === kda.kda) {
          precision = assetPrecision;
        }
      });
      kda.totalAmount = kda.totalAmount / 10 ** precision;
      kda.totalClaimed = kda.totalClaimed / 10 ** precision;
      kda.precision = precision;
    });
  });
};

interface ITransactionResponse {
  data?: {
    transactions?: ITransaction[];
  };
}

export const getParsedTransactionPrecision = async (
  transactionsResponse: ITransactionResponse,
): Promise<ITransaction[] | undefined> => {
  const assets: string[] = [];

  transactionsResponse?.data?.transactions?.forEach(
    (transaction: ITransaction) => {
      if (transaction?.contract && transaction?.contract?.length) {
        transaction?.contract?.forEach(contract => {
          assets.push(...getAssetsAndCurrenciesList(contract, transaction));
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

          transaction.precision = getTransactionPrecision(
            contract,
            transaction,
            assetPrecisions,
          );
        });
      }
      return transaction;
    },
  );

  return parsedTransactions;
};
