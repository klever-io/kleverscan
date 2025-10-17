import api from '@/services/api';
import {
  IAssetsResponse,
  ICollection,
  ICollectionIdListResponse,
} from '@/types';
import { NextRouter } from 'next/router';

export const collectionListCall = async (
  router: NextRouter,
  walletAddress: string,
  partialId?: string,
  isSFT = false,
): Promise<ICollection[] | undefined> => {
  try {
    const parsedCollection = JSON.parse(
      router?.query?.contractDetails as string,
    ).collection;

    if (isSFT) {
      const res: IAssetsResponse = await api.get({
        route: `assets/sft/${parsedCollection}`,
      });

      if (!res.error || res.error === '') {
        return res.data.assets as unknown as ICollection[];
      }
    }

    const res: ICollectionIdListResponse = await api.get({
      route: `address/${walletAddress}/collection/${parsedCollection}?page=${
        partialId ? Number(partialId) : 0
      }`,
    });

    if (!res.error || res.error === '') {
      return res.data.collection;
    }
  } catch (error) {
    console.error(error);
  }
};
