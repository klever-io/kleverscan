import api from '@/services/api';
import { IPrecisionResponse, Service } from '@/types';
import { toast } from 'react-toastify';

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
    const NFTs: { [assetId: string]: number } = {};
    assetIds.forEach(assetId => {
      if (
        !Object.keys(storedPrecisions).includes(assetId) &&
        assetId !== '' &&
        !aux.includes(assetId) &&
        assetId.split('/').length === 1
      ) {
        aux.push(assetId);
      } else if (assetId.split('/').length > 1) {
        NFTs[assetId] = 0;
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
      const newPrecisions = { ...storedPrecisions, ...precisions, ...NFTs };
      localStorage.setItem('precisions', JSON.stringify(newPrecisions));
      return assetIds.reduce((prev, current) => {
        return {
          ...prev,
          [current]: newPrecisions[current],
        };
      }, {});
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  } else if (typeof assetIds === 'string') {
    const assetId = assetIds;

    if (assetId.split('/').length === 2) {
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
        return precisions[assetId];
      } catch (error: any) {
        throw new Error(error);
      }
    } else {
      return storedPrecisions[assetId.split('/')[0]];
    }
  } else {
    throw new Error('Invalid Param');
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
