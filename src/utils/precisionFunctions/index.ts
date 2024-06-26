import api from '@/services/api';
import { IAsset, IFPR, IKDAFPR, IPrecisionResponse, Service } from '@/types';
import { toast } from 'react-toastify';
import { KLV_PRECISION } from '../globalVariables';

export function getPrecision<T extends string | string[]>(
  assetIds: T,
): T extends string ? Promise<number> : Promise<{ [assetId: string]: number }>;

export async function getPrecision(
  assetIds: string | string[],
): Promise<number | { [assetId: string]: number }> {
  const storedPrecisions: any = localStorage.getItem('precisions')
    ? JSON.parse(localStorage.getItem('precisions') || '{}')
    : {};

  if (typeof assetIds === 'object' && assetIds.length !== undefined) {
    if (assetIds.length === 0) {
      return {};
    }
    const aux: string[] = [];

    assetIds.forEach(assetId => {
      if (
        !Object.keys(storedPrecisions).includes(assetId) &&
        assetId !== '' &&
        !aux.includes(assetId)
      ) {
        aux.push(assetId);
      }
    });

    if (aux.length === 0) {
      return assetIds.reduce((prev, current) => {
        return {
          ...prev,
          [current]: storedPrecisions[current],
        };
      }, {});
    }
    try {
      const { precisions } = await getPrecisionFromApi(aux);
      const newPrecisions = { ...storedPrecisions, ...precisions };
      localStorage.setItem('precisions', JSON.stringify(newPrecisions));
      return assetIds.reduce((prev, current) => {
        return {
          ...prev,
          [current]: newPrecisions[current],
        };
      }, {});
    } catch (error: any) {
      console.error(error);
      return Object.keys(assetIds).reduce((prev, current) => {
        return {
          ...prev,
          [current]: 0,
        };
      }, {});
    }
  } else if (typeof assetIds === 'string') {
    const assetId = assetIds;

    if (assetId === '') {
      console.error('Empty Asset ID');
      return 0;
    }

    if (
      !storedPrecisions ||
      !Object.keys(storedPrecisions).includes(assetId.split('/')[0])
    ) {
      try {
        const { precisions } = (await getPrecisionFromApi([assetId])) || 0;
        const newPrecisions = { ...storedPrecisions, ...precisions };
        localStorage.setItem('precisions', JSON.stringify(newPrecisions));
        if (precisions[assetId] === undefined) {
          console.error(`Asset not found - ${assetId}`);
          return 0;
        }
        return precisions[assetId];
      } catch (error: any) {
        console.error(error);
        return 0;
      }
    } else {
      return storedPrecisions[assetId.split('/')[0]];
    }
  } else {
    console.error('Invalid assetId');
    return 0;
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
      body: { assets },
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
