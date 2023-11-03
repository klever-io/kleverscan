import { IDropdownItem } from '@/components/Contract/Select';
import api from '@/services/api';
import { ICollectionIdListResponse } from '@/types';
import { NextRouter } from 'next/router';

export const collectionListCall = async (
  router: NextRouter,
  walletAddress: string,
  partialId?: string,
): Promise<IDropdownItem[] | undefined> => {
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
      const parseResponse = res.data.collection.map(e => {
        const parseCollectionId = e.assetId.split('/')[1];
        return { label: parseCollectionId, value: parseCollectionId };
      });
      return parseResponse;
    }
  } catch (error) {
    console.error(error);
  }
};
