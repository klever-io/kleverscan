import api from '@/services/api';
import { ICollection, ICollectionIdListResponse } from '@/types';
import { NextRouter } from 'next/router';

export const collectionListCall = async (
  router: NextRouter,
  walletAddress: string,
  partialId?: string,
): Promise<ICollection[] | undefined> => {
  try {
    const parseCollection = JSON.parse(
      router?.query?.contractDetails as string,
    ).collection;

    const res: ICollectionIdListResponse = await api.get({
      route: `address/${walletAddress}/collection/${parseCollection}?page=${
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
